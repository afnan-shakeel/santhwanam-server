/**
 * Commands for Organization Bodies
 * Thin wrappers around services with AsyncLocalStorage actor tracking
 */

import type { ForumService } from '../forumService';
import type { AreaService } from '../areaService';
import type { UnitService } from '../unitService';
import { asyncLocalStorage } from '@/shared/infrastructure/context/AsyncLocalStorageManager';
import { UnauthorizedError } from '@/shared/utils/error-handling/httpErrors';

// Forum Commands

export interface CreateForumDTO {
  forumCode: string;
  forumName: string;
  adminUserId: string;
  establishedDate: Date;
}

export class CreateForumCommand {
  constructor(private readonly forumService: ForumService) {}

  async execute(dto: CreateForumDTO) {
    const createdBy = asyncLocalStorage.tryGetUserId();
    if (!createdBy) {
      throw new UnauthorizedError('User not authenticated');
    }

    return this.forumService.createForum({ ...dto, createdBy });
  }
}

export interface UpdateForumDTO {
  forumName?: string;
  establishedDate?: Date;
}

export class UpdateForumCommand {
  constructor(private readonly forumService: ForumService) {}

  async execute(forumId: string, dto: UpdateForumDTO) {
    const updatedBy = asyncLocalStorage.tryGetUserId();
    if (!updatedBy) {
      throw new UnauthorizedError('User not authenticated');
    }

    return this.forumService.updateForum(forumId, { ...dto, updatedBy });
  }
}

export interface AssignForumAdminDTO {
  newAdminUserId: string;
}

export class AssignForumAdminCommand {
  constructor(private readonly forumService: ForumService) {}

  async execute(forumId: string, dto: AssignForumAdminDTO) {
    const assignedBy = asyncLocalStorage.tryGetUserId();
    if (!assignedBy) {
      throw new UnauthorizedError('User not authenticated');
    }

    return this.forumService.assignForumAdmin(forumId, dto.newAdminUserId, assignedBy);
  }
}

// Area Commands

export interface CreateAreaDTO {
  forumId: string;
  areaCode: string;
  areaName: string;
  adminUserId: string;
  establishedDate: Date;
}

export class CreateAreaCommand {
  constructor(private readonly areaService: AreaService) {}

  async execute(dto: CreateAreaDTO) {
    const createdBy = asyncLocalStorage.tryGetUserId();
    if (!createdBy) {
      throw new UnauthorizedError('User not authenticated');
    }

    return this.areaService.createArea({ ...dto, createdBy });
  }
}

export interface UpdateAreaDTO {
  areaName?: string;
  establishedDate?: Date;
}

export class UpdateAreaCommand {
  constructor(private readonly areaService: AreaService) {}

  async execute(areaId: string, dto: UpdateAreaDTO) {
    const updatedBy = asyncLocalStorage.tryGetUserId();
    if (!updatedBy) {
      throw new UnauthorizedError('User not authenticated');
    }

    return this.areaService.updateArea(areaId, { ...dto, updatedBy });
  }
}

export interface AssignAreaAdminDTO {
  newAdminUserId: string;
}

export class AssignAreaAdminCommand {
  constructor(private readonly areaService: AreaService) {}

  async execute(areaId: string, dto: AssignAreaAdminDTO) {
    const assignedBy = asyncLocalStorage.tryGetUserId();
    if (!assignedBy) {
      throw new UnauthorizedError('User not authenticated');
    }

    return this.areaService.assignAreaAdmin(areaId, dto.newAdminUserId, assignedBy);
  }
}

// Unit Commands

export interface CreateUnitDTO {
  areaId: string;
  unitCode: string;
  unitName: string;
  adminUserId: string;
  establishedDate: Date;
}

export class CreateUnitCommand {
  constructor(private readonly unitService: UnitService) {}

  async execute(dto: CreateUnitDTO) {
    const createdBy = asyncLocalStorage.tryGetUserId();
    if (!createdBy) {
      throw new UnauthorizedError('User not authenticated');
    }

    return this.unitService.createUnit({ ...dto, createdBy });
  }
}

export interface UpdateUnitDTO {
  unitName?: string;
  establishedDate?: Date;
}

export class UpdateUnitCommand {
  constructor(private readonly unitService: UnitService) {}

  async execute(unitId: string, dto: UpdateUnitDTO) {
    const updatedBy = asyncLocalStorage.tryGetUserId();
    if (!updatedBy) {
      throw new UnauthorizedError('User not authenticated');
    }

    return this.unitService.updateUnit(unitId, { ...dto, updatedBy });
  }
}

export interface AssignUnitAdminDTO {
  newAdminUserId: string;
}

export class AssignUnitAdminCommand {
  constructor(private readonly unitService: UnitService) {}

  async execute(unitId: string, dto: AssignUnitAdminDTO) {
    const assignedBy = asyncLocalStorage.tryGetUserId();
    if (!assignedBy) {
      throw new UnauthorizedError('User not authenticated');
    }

    return this.unitService.assignUnitAdmin(unitId, dto.newAdminUserId, assignedBy);
  }
}
