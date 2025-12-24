/**
 * Command: Update Approval Workflow
 * Updates workflow with enhanced stage management logic
 * Handles adding, updating, and removing stages intelligently
 */

import type { ApprovalWorkflowService } from '../approvalWorkflowService';
import type { organizationBody, WorkflowModule } from '../../domain/entities';
import { asyncLocalStorage } from '@/shared/infrastructure/context/AsyncLocalStorageManager';
import { UnauthorizedError } from '@/shared/utils/error-handling/httpErrors';

export interface UpdateWorkflowCommandDTO {
  workflowId: string;
  workflowName?: string;
  description?: string | null;
  isActive?: boolean;
  requiresAllStages?: boolean;
  stages?: Array<{
    stageId?: string | null; // null/undefined = new stage, uuid = update existing
    stageName: string;
    stageOrder: number;
    approverType: string;
    roleId?: string | null;
    userId?: string | null;
    organizationBody?: organizationBody | null;
    isOptional?: boolean;
    autoApprove?: boolean;
  }>;
}

export class UpdateWorkflowCommand {
  constructor(private readonly workflowService: ApprovalWorkflowService) {}

  async execute(dto: UpdateWorkflowCommandDTO) {
    const currentUserId = asyncLocalStorage.tryGetUserId();
    if (!currentUserId) {
      throw new UnauthorizedError('User not authenticated');
    }

    return this.workflowService.updateWorkflowWithStages({
      ...dto,
      updatedBy: currentUserId,
    });
  }
}
