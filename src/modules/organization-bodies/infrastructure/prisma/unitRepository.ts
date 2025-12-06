/**
 * Prisma implementation of UnitRepository
 */

import type { UnitRepository } from '../../domain/repositories';
import type { Unit } from '../../domain/entities';
import prisma from '@/shared/infrastructure/prisma/prismaClient';

export class PrismaUnitRepository implements UnitRepository {
  async create(
    data: {
      areaId: string;
      forumId: string;
      unitCode: string;
      unitName: string;
      adminUserId: string;
      establishedDate: Date;
      createdBy: string;
    },
    tx?: any
  ): Promise<Unit> {
    const client = tx ?? prisma;
    return client.unit.create({
      data: {
        areaId: data.areaId,
        forumId: data.forumId,
        unitCode: data.unitCode,
        unitName: data.unitName,
        adminUserId: data.adminUserId,
        establishedDate: data.establishedDate,
        createdBy: data.createdBy,
      },
    });
  }

  async findById(unitId: string, tx?: any): Promise<Unit | null> {
    const client = tx ?? prisma;
    return client.unit.findUnique({
      where: { unitId },
    });
  }

  async findByCode(areaId: string, unitCode: string, tx?: any): Promise<Unit | null> {
    const client = tx ?? prisma;
    return client.unit.findUnique({
      where: {
        areaId_unitCode: {
          areaId,
          unitCode,
        },
      },
    });
  }

  async update(
    unitId: string,
    data: {
      unitName?: string;
      establishedDate?: Date;
      updatedBy: string;
    },
    tx?: any
  ): Promise<Unit> {
    const client = tx ?? prisma;
    return client.unit.update({
      where: { unitId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  async updateAdmin(
    unitId: string,
    adminUserId: string,
    updatedBy: string,
    tx?: any
  ): Promise<Unit> {
    const client = tx ?? prisma;
    return client.unit.update({
      where: { unitId },
      data: {
        adminUserId,
        updatedBy,
        updatedAt: new Date(),
      },
    });
  }

  async listByArea(areaId: string, tx?: any): Promise<Unit[]> {
    const client = tx ?? prisma;
    return client.unit.findMany({
      where: { areaId },
      orderBy: { unitName: 'asc' },
    });
  }

  async listByForum(forumId: string, tx?: any): Promise<Unit[]> {
    const client = tx ?? prisma;
    return client.unit.findMany({
      where: { forumId },
      orderBy: { unitName: 'asc' },
    });
  }

  async existsByCode(areaId: string, unitCode: string, tx?: any): Promise<boolean> {
    const client = tx ?? prisma;
    const count = await client.unit.count({
      where: {
        areaId,
        unitCode,
      },
    });
    return count > 0;
  }
}
