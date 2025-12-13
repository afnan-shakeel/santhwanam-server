/**
 * Service for managing Forums
 * Handles forum CRUD operations with permission checks
 */

import type { ForumRepository } from '../domain/repositories';
import type { Forum } from '../domain/entities';
import type { UserRepository } from '@/modules/iam/domain/repositories';
import { BadRequestError, NotFoundError, ForbiddenError } from '@/shared/utils/error-handling/httpErrors';
import prisma from '@/shared/infrastructure/prisma/prismaClient';
import { searchService, SearchRequest } from '@/shared/infrastructure/search';

export class ForumService {
  constructor(
    private readonly forumRepo: ForumRepository,
    private readonly userRepo: UserRepository
  ) {}

  /**
   * Create a new forum (Super Admin only)
   */
  async createForum(data: {
    forumCode: string;
    forumName: string;
    adminUserId: string;
    establishedDate: Date;
    createdBy: string;
  }): Promise<Forum> {
    // Validate forumCode format
    if (!/^[a-zA-Z0-9_-]{3,50}$/.test(data.forumCode)) {
      throw new BadRequestError(
        'forumCode must be alphanumeric with hyphens/underscores, 3-50 characters'
      );
    }

    // Validate forumName length
    if (data.forumName.length < 3 || data.forumName.length > 255) {
      throw new BadRequestError('forumName must be 3-255 characters');
    }

    // Validate established date is not in future
    console.log('Established Date:', data.establishedDate);
    if (data.establishedDate > new Date()) {
      throw new BadRequestError('establishedDate cannot be in the future');
    }

    // Check forumCode uniqueness
    const exists = await this.forumRepo.existsByCode(data.forumCode);
    if (exists) {
      throw new BadRequestError(`Forum code ${data.forumCode} already exists`);
    }

    // Validate admin user exists
    const adminUser = await this.userRepo.findById(data.adminUserId);
    if (!adminUser) {
      throw new NotFoundError('Admin user not found');
    }

    // Create forum in transaction
    return await prisma.$transaction(async (tx) => {
      const forum = await this.forumRepo.create(data, tx);

      // TODO: Assign Forum Admin role to adminUserId
      // Will be implemented after role assignment logic is ready

      return forum;
    });
  }

  /**
   * Update forum details
   */
  async updateForum(
    forumId: string,
    data: {
      forumName?: string;
      establishedDate?: Date;
      updatedBy: string;
    }
  ): Promise<Forum> {
    const forum = await this.forumRepo.findById(forumId);
    if (!forum) {
      throw new NotFoundError('Forum not found');
    }

    // Validate forumName if provided
    if (data.forumName && (data.forumName.length < 3 || data.forumName.length > 255)) {
      throw new BadRequestError('forumName must be 3-255 characters');
    }

    // Validate establishedDate if provided
    if (data.establishedDate && data.establishedDate > new Date()) {
      throw new BadRequestError('establishedDate cannot be in the future');
    }

    return this.forumRepo.update(forumId, data);
  }

  /**
   * Assign forum admin (Super Admin only)
   */
  async assignForumAdmin(
    forumId: string,
    newAdminUserId: string,
    assignedBy: string
  ): Promise<Forum> {
    const forum = await this.forumRepo.findById(forumId);
    if (!forum) {
      throw new NotFoundError('Forum not found');
    }

    // Validate new admin user exists
    const newAdmin = await this.userRepo.findById(newAdminUserId);
    if (!newAdmin) {
      throw new NotFoundError('New admin user not found');
    }

    return await prisma.$transaction(async (tx) => {
      const updatedForum = await this.forumRepo.updateAdmin(
        forumId,
        newAdminUserId,
        assignedBy,
        tx
      );

      // TODO: Revoke old admin's Forum Admin role, assign to new admin
      // Will be implemented after role assignment logic is ready

      return updatedForum;
    });
  }

  /**
   * Get forum by ID
   */
  async getForumById(forumId: string): Promise<Forum> {
    const forum = await this.forumRepo.findById(forumId);
    if (!forum) {
      throw new NotFoundError('Forum not found');
    }
    return forum;
  }

  /**
   * Get forum by code
   */
  async getForumByCode(forumCode: string): Promise<Forum> {
    const forum = await this.forumRepo.findByCode(forumCode);
    if (!forum) {
      throw new NotFoundError('Forum not found');
    }
    return forum;
  }

  /**
   * List all forums
   */
  async listForums(): Promise<Forum[]> {
    return this.forumRepo.listAll();
  }

  /**
   * Search forums with advanced filtering
   */
  async searchForums(searchRequest: Omit<SearchRequest, 'model'>) {
    return searchService.execute({
      ...searchRequest,
      model: 'Forum'
    });
  }
}
