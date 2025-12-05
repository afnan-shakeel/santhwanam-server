import prisma from '@/shared/infrastructure/prisma/prismaClient'
import { Permission } from '../../domain/entities'
import { PermissionRepository } from '../../domain/repositories'

export class PrismaPermissionRepository implements PermissionRepository {
  async create(data: {
    permissionCode: string
    permissionName: string
    description?: string | null
    module?: string | null
    action?: string | null
  }): Promise<Permission> {
    const p = await prisma.permission.create({
      data: {
        permissionCode: data.permissionCode,
        permissionName: data.permissionName,
        description: data.description ?? null,
        module: data.module ?? null,
        action: data.action ?? null,
        isActive: true,
      },
    })
    return {
      permissionId: p.permissionId,
      permissionCode: p.permissionCode,
      permissionName: p.permissionName,
      description: p.description,
      module: p.module,
      action: p.action,
      isActive: p.isActive,
      createdAt: p.createdAt,
    }
  }

  async findByCode(code: string): Promise<Permission | null> {
    const p = await prisma.permission.findUnique({ where: { permissionCode: code } })
    if (!p) return null
    return {
      permissionId: p.permissionId,
      permissionCode: p.permissionCode,
      permissionName: p.permissionName,
      description: p.description,
      module: p.module,
      action: p.action,
      isActive: p.isActive,
      createdAt: p.createdAt,
    }
  }

  async listAll(): Promise<Permission[]> {
    const rows = await prisma.permission.findMany({ orderBy: { createdAt: 'asc' } })
    return rows.map((p) => ({
      permissionId: p.permissionId,
      permissionCode: p.permissionCode,
      permissionName: p.permissionName,
      description: p.description,
      module: p.module,
      action: p.action,
      isActive: p.isActive,
      createdAt: p.createdAt,
    }))
  }
}
