import { Permission, Role } from './entities'

export interface PermissionRepository {
  create(data: {
    permissionCode: string
    permissionName: string
    description?: string | null
    module?: string | null
    action?: string | null
  }): Promise<Permission>

  findByCode(code: string): Promise<Permission | null>

  listAll(): Promise<Permission[]>
}

export interface RoleRepository {
  create(data: {
    roleCode: string
    roleName: string
    description?: string | null
    scopeType: Role['scopeType']
    isSystemRole?: boolean
  }): Promise<Role>

  findByCode(code: string): Promise<Role | null>

  listAll(): Promise<Role[]>
}
