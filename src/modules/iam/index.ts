import { PrismaPermissionRepository } from './infrastructure/prisma/permissionRepository'
import { PrismaRoleRepository } from './infrastructure/prisma/roleRepository'
import { PermissionService } from './application/permissionService'
import { RoleService } from './application/roleService'

const permissionRepo = new PrismaPermissionRepository()
const roleRepo = new PrismaRoleRepository()

export const permissionService = new PermissionService(permissionRepo)
export const roleService = new RoleService(roleRepo)

export { PrismaPermissionRepository, PrismaRoleRepository }
