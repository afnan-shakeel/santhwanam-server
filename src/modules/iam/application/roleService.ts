import { RoleRepository } from '../domain/repositories'
import { ConflictError } from '@/shared/utils/error-handling/httpErrors'
import { searchService, SearchRequest } from '@/shared/infrastructure/search'

export class RoleService {
  constructor(private repo: RoleRepository) {}

  async listRoles() {
    return this.repo.listAll()
  }

  async searchRoles(searchRequest: Omit<SearchRequest, 'model'>) {
    return searchService.execute({
      ...searchRequest,
      model: 'Role'
    })
  }

  async createRole(data: {
    roleCode: string
    roleName: string
    description?: string | null
    scopeType: 'None' | 'Forum' | 'Area' | 'Unit' | 'Agent'
    isSystemRole?: boolean
  }) {
    const exists = await this.repo.findByCode(data.roleCode)
    if (exists) throw new ConflictError('Role Code already exists')
    return this.repo.create(data)
  }
}
