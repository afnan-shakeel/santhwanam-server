/**
 * Prisma implementation of AreaRepository
 */

import type { AreaRepository } from '../../domain/repositories';
import type { Area } from '../../domain/entities';
import prisma from '@/shared/infrastructure/prisma/prismaClient';

export class PrismaAreaRepository implements AreaRepository {
  async create(
    data: {
      forumId: string;
      areaCode: string;
      areaName: string;
      adminUserId: string;
      establishedDate: Date;
      createdBy: string;
    },
    tx?: any
  ): Promise<Area> {
    const client = tx ?? prisma;
    return client.area.create({
      data: {
        forumId: data.forumId,
        areaCode: data.areaCode,
        areaName: data.areaName,
        adminUserId: data.adminUserId,
        establishedDate: data.establishedDate,
        createdBy: data.createdBy,
      },
    });
  }

  async findById(areaId: string, tx?: any): Promise<Area | null> {
    const client = tx ?? prisma;
    return client.area.findUnique({
      where: { areaId },
    });
  }

  async findByCode(forumId: string, areaCode: string, tx?: any): Promise<Area | null> {
    const client = tx ?? prisma;
    return client.area.findUnique({
      where: {
        forumId_areaCode: {
          forumId,
          areaCode,
        },
      },
    });
  }

  async update(
    areaId: string,
    data: {
      areaName?: string;
      establishedDate?: Date;
      updatedBy: string;
    },
    tx?: any
  ): Promise<Area> {
    const client = tx ?? prisma;
    return client.area.update({
      where: { areaId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  async updateAdmin(
    areaId: string,
    adminUserId: string,
    updatedBy: string,
    tx?: any
  ): Promise<Area> {
    const client = tx ?? prisma;
    return client.area.update({
      where: { areaId },
      data: {
        adminUserId,
        updatedBy,
        updatedAt: new Date(),
      },
    });
  }

  async listByForum(forumId: string, tx?: any): Promise<Area[]> {
    const client = tx ?? prisma;
    return client.area.findMany({
      where: { forumId },
      orderBy: { areaName: 'asc' },
    });
  }

  async existsByCode(forumId: string, areaCode: string, tx?: any): Promise<boolean> {
    const client = tx ?? prisma;
    const count = await client.area.count({
      where: {
        forumId,
        areaCode,
      },
    });
    return count > 0;
  }
}
