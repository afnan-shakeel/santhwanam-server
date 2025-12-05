export type Filter = {
  field: string
  value: string | number | boolean | Array<any> | { from: any; to: any }
  operator: FilterOperator
  negate?: boolean
}

export type FilterOperator =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'in'
  | 'notIn'
  | 'gte'
  | 'lte'
  | 'gt'
  | 'lt'
  | 'between'
  | 'isNull'
  | 'isNotNull'

export type SearchRequest = {
  model: string
  filters?: Filter[]
  searchTerm?: string
  searchFields?: string[]
  sortBy?: string | string[]
  sortOrder?: 'asc' | 'desc' | Record<string, 'asc' | 'desc'>
  page?: number
  pageSize?: number
  eagerLoad?: string[]
}

export type SearchResult<T = any> = {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export type ModelConfig = {
  searchable: string[]
  sortable: string[]
  filters: string[]
  relations: string[]
}

export type ModelConfigs = Record<string, ModelConfig>
