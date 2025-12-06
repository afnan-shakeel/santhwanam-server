/**
 * Repository interfaces for Organization Bodies
 * Implementations in infrastructure/prisma/
 */

import type { Forum, Area, Unit } from './entities';

export interface ForumRepository {
  create(
    data: {
      forumCode: string;
      forumName: string;
      adminUserId: string;
      establishedDate: Date;
      createdBy: string;
    },
    tx?: any
  ): Promise<Forum>;

  findById(forumId: string, tx?: any): Promise<Forum | null>;

  findByCode(forumCode: string, tx?: any): Promise<Forum | null>;

  update(
    forumId: string,
    data: {
      forumName?: string;
      establishedDate?: Date;
      updatedBy: string;
    },
    tx?: any
  ): Promise<Forum>;

  updateAdmin(forumId: string, adminUserId: string, updatedBy: string, tx?: any): Promise<Forum>;

  listAll(tx?: any): Promise<Forum[]>;

  existsByCode(forumCode: string, tx?: any): Promise<boolean>;
}

export interface AreaRepository {
  create(
    data: {
      forumId: string;
      areaCode: string;
      areaName: string;
      adminUserId: string;
      establishedDate: Date;
      createdBy: string;
    },
    tx?: any
  ): Promise<Area>;

  findById(areaId: string, tx?: any): Promise<Area | null>;

  findByCode(forumId: string, areaCode: string, tx?: any): Promise<Area | null>;

  update(
    areaId: string,
    data: {
      areaName?: string;
      establishedDate?: Date;
      updatedBy: string;
    },
    tx?: any
  ): Promise<Area>;

  updateAdmin(areaId: string, adminUserId: string, updatedBy: string, tx?: any): Promise<Area>;

  listByForum(forumId: string, tx?: any): Promise<Area[]>;

  existsByCode(forumId: string, areaCode: string, tx?: any): Promise<boolean>;
}

export interface UnitRepository {
  create(
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
  ): Promise<Unit>;

  findById(unitId: string, tx?: any): Promise<Unit | null>;

  findByCode(areaId: string, unitCode: string, tx?: any): Promise<Unit | null>;

  update(
    unitId: string,
    data: {
      unitName?: string;
      establishedDate?: Date;
      updatedBy: string;
    },
    tx?: any
  ): Promise<Unit>;

  updateAdmin(unitId: string, adminUserId: string, updatedBy: string, tx?: any): Promise<Unit>;

  listByArea(areaId: string, tx?: any): Promise<Unit[]>;

  listByForum(forumId: string, tx?: any): Promise<Unit[]>;

  existsByCode(areaId: string, unitCode: string, tx?: any): Promise<boolean>;
}
