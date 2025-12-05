import prisma from '@/shared/infrastructure/prisma/prismaClient'
import { Role } from '../../domain/entities'
import { RoleRepository } from '../../domain/repositories'

export class PrismaRoleRepository implements RoleRepository {
  async create(data: {
    roleCode: string
    roleName: string
    description?: string | null
    scopeType: Role['scopeType']
    isSystemRole?: boolean
  }): Promise<Role> {
    const r = await prisma.role.create({
      data: {
        roleCode: data.roleCode,
        roleName: data.roleName,
        description: data.description ?? null,
        scopeType: data.scopeType,
        isActive: true,
        isSystemRole: data.isSystemRole ?? false,
      },
    })
    return {
      roleId: r.roleId,
      roleCode: r.roleCode,
      roleName: r.roleName,
      description: r.description,
      scopeType: r.scopeType as Role['scopeType'],
      isActive: r.isActive,
      isSystemRole: r.isSystemRole,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt ?? null,
    }
  }

  async findByCode(code: string): Promise<Role | null> {
    const r = await prisma.role.findUnique({ where: { roleCode: code } })
    if (!r) return null
    return {
      roleId: r.roleId,
      roleCode: r.roleCode,
      roleName: r.roleName,
      description: r.description,
      scopeType: r.scopeType as Role['scopeType'],
      isActive: r.isActive,
      isSystemRole: r.isSystemRole,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt ?? null,
    }
  }

  async listAll(): Promise<Role[]> {
    const rows = await prisma.role.findMany({ orderBy: { createdAt: 'asc' } })
    return rows.map((r) => ({
      roleId: r.roleId,
      roleCode: r.roleCode,
      roleName: r.roleName,
      description: r.description,
      scopeType: r.scopeType as Role['scopeType'],
      isActive: r.isActive,
      isSystemRole: r.isSystemRole,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt ?? null,
    }))
  }
}
