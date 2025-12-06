/**
 * Command: Create Approval Workflow
 * Creates a new workflow with stages
 */

import type { ApprovalWorkflowService } from '../approvalWorkflowService';
import type { WorkflowModule } from '../../domain/entities';
import { asyncLocalStorage } from '@/shared/infrastructure/context/AsyncLocalStorageManager';
import { UnauthorizedError } from '@/shared/utils/error-handling/httpErrors';

export interface CreateWorkflowCommandDTO {
  workflowCode: string;
  workflowName: string;
  description?: string;
  module: WorkflowModule;
  entityType: string;
  isActive?: boolean;
  requiresAllStages?: boolean;
  stages: Array<{
    stageName: string;
    stageOrder: number;
    approverType: string;
    roleId?: string | null;
    userId?: string | null;
    hierarchyLevel?: string | null;
    isOptional?: boolean;
    autoApprove?: boolean;
  }>;
}

export class CreateWorkflowCommand {
  constructor(private readonly workflowService: ApprovalWorkflowService) {}

  async execute(dto: CreateWorkflowCommandDTO) {
    const currentUserId = asyncLocalStorage.tryGetUserId();
    if (!currentUserId) {
      throw new UnauthorizedError('User not authenticated');
    }

    return this.workflowService.createWorkflow({
      ...dto,
      createdBy: currentUserId,
    });
  }
}
