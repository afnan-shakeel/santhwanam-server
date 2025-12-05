import { BadRequestError } from '@/shared/utils/error-handling/httpErrors'
import { Filter, ModelConfig } from './types'

export function buildPagination(page = 1, pageSize = 10) {
  const take = Math.min(pageSize, 100) // enforce max page size
  const skip = (Math.max(page, 1) - 1) * take
  return { skip, take }
}

export function buildSearchWhere(searchTerm?: string, fields: string[] = []) {
  if (!searchTerm || !fields.length) return undefined
  return {
    OR: fields.map((field) => ({
      [field]: { contains: searchTerm, mode: 'insensitive' as const },
    })),
  }
}

export function buildFiltersWhere(filters: Filter[] = []) {
  if (!filters.length) return undefined
  
  const clauses = filters.map((f) => {
    let clause: any
    
    switch (f.operator) {
      case 'equals':
        clause = { [f.field]: f.value }
        break
      case 'notEquals':
        clause = { [f.field]: { not: f.value } }
        break
      case 'contains':
        clause = { [f.field]: { contains: f.value, mode: 'insensitive' } }
        break
      case 'in':
        clause = { [f.field]: { in: Array.isArray(f.value) ? f.value : [f.value] } }
        break
      case 'notIn':
        clause = { [f.field]: { notIn: Array.isArray(f.value) ? f.value : [f.value] } }
        break
      case 'gte':
        clause = { [f.field]: { gte: f.value } }
        break
      case 'lte':
        clause = { [f.field]: { lte: f.value } }
        break
      case 'gt':
        clause = { [f.field]: { gt: f.value } }
        break
      case 'lt':
        clause = { [f.field]: { lt: f.value } }
        break
      case 'between':
        if (typeof f.value === 'object' && f.value && 'from' in f.value && 'to' in f.value) {
          clause = { [f.field]: { gte: f.value.from, lte: f.value.to } }
        } else {
          throw new BadRequestError(`Invalid between value for field ${f.field}`)
        }
        break
      case 'isNull':
        clause = { [f.field]: null }
        break
      case 'isNotNull':
        clause = { [f.field]: { not: null } }
        break
      default:
        throw new BadRequestError(`Unsupported operator ${f.operator}`)
    }
    
    return f.negate ? { NOT: clause } : clause
  })
  
  return clauses.length === 1 ? clauses[0] : { AND: clauses }
}

export function buildSort(sortBy?: string | string[], sortOrder?: 'asc' | 'desc' | Record<string, 'asc' | 'desc'>, modelConfig?: ModelConfig) {
  if (!sortBy) return undefined
  
  if (Array.isArray(sortBy)) {
    return sortBy.map((field) => {
      if (modelConfig && !modelConfig.sortable.includes(field)) {
        throw new BadRequestError(`Field ${field} is not sortable`)
      }
      const order = typeof sortOrder === 'object' ? sortOrder[field] || 'asc' : sortOrder || 'asc'
      return { [field]: order }
    })
  } else {
    if (modelConfig && !modelConfig.sortable.includes(sortBy)) {
      throw new BadRequestError(`Field ${sortBy} is not sortable`)
    }
    const order = typeof sortOrder === 'string' ? sortOrder : 'asc'
    return { [sortBy]: order }
  }
}

export function buildEagerLoad(eagerLoad: string[] = [], modelConfig?: ModelConfig) {
  if (!eagerLoad.length) return undefined
  
  const include: Record<string, boolean> = {}
  eagerLoad.forEach((rel) => {
    if (modelConfig && !modelConfig.relations.includes(rel)) {
      throw new BadRequestError(`Relation ${rel} is not allowed for eager loading`)
    }
    include[rel] = true
  })
  
  return include
}

export function validateFilters(filters: Filter[] = [], modelConfig: ModelConfig) {
  filters.forEach((filter) => {
    if (!modelConfig.filters.includes(filter.field)) {
      throw new BadRequestError(`Field ${filter.field} is not allowed for filtering`)
    }
  })
}

export function validateSearchFields(searchFields: string[] = [], modelConfig: ModelConfig) {
  searchFields.forEach((field) => {
    if (!modelConfig.searchable.includes(field)) {
      throw new BadRequestError(`Field ${field} is not searchable`)
    }
  })
}
