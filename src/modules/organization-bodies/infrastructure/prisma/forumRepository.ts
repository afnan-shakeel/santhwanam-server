/**
 * Prisma implementation of ForumRepository
 */

import type { ForumRepository } from '../../domain/repositories';
import type { Forum } from '../../domain/entities';
import prisma from '@/shared/infrastructure/prisma/prismaClient';

export class PrismaForumRepository implements ForumRepository {
  async create(
    data: {
      forumCode: string;
      forumName: string;
      adminUserId: string;
      establishedDate: Date;
      createdBy: string;
    },
    tx?: any
  ): Promise<Forum> {
    const client = tx ?? prisma;
    return client.forum.create({
      data: {
        forumCode: data.forumCode,
        forumName: data.forumName,
        adminUserId: data.adminUserId,
        establishedDate: data.establishedDate,
        createdBy: data.createdBy,
      },
    });
  }

  async findById(forumId: string, tx?: any): Promise<Forum | null> {
    const client = tx ?? prisma;
    return client.forum.findUnique({
      where: { forumId },
    });
  }

  async findByCode(forumCode: string, tx?: any): Promise<Forum | null> {
    const client = tx ?? prisma;
    return client.forum.findUnique({
      where: { forumCode },
    });
  }

  async update(
    forumId: string,
    data: {
      forumName?: string;
      establishedDate?: Date;
      updatedBy: string;
    },
    tx?: any
  ): Promise<Forum> {
    const client = tx ?? prisma;
    return client.forum.update({
      where: { forumId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  async updateAdmin(
    forumId: string,
    adminUserId: string,
    updatedBy: string,
    tx?: any
  ): Promise<Forum> {
    const client = tx ?? prisma;
    return client.forum.update({
      where: { forumId },
      data: {
        adminUserId,
        updatedBy,
        updatedAt: new Date(),
      },
    });
  }

  async listAll(tx?: any): Promise<Forum[]> {
    const client = tx ?? prisma;
    return client.forum.findMany({
      orderBy: { forumName: 'asc' },
    });
  }

  async existsByCode(forumCode: string, tx?: any): Promise<boolean> {
    const client = tx ?? prisma;
    const count = await client.forum.count({
      where: { forumCode },
    });
    return count > 0;
  }
}
