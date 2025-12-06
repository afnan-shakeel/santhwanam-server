/**
 * Command: Process Approval
 * Approve or reject an approval stage
 */

import type { ApprovalRequestService } from '../approvalRequestService';
import type { ApprovalDecision } from '../../domain/entities';
import { asyncLocalStorage } from '@/shared/infrastructure/context/AsyncLocalStorageManager';
import { UnauthorizedError } from '@/shared/utils/error-handling/httpErrors';

export interface ProcessApprovalCommandDTO {
  executionId: string;
  decision: ApprovalDecision;
  comments?: string;
}

export class ProcessApprovalCommand {
  constructor(private readonly requestService: ApprovalRequestService) {}

  async execute(dto: ProcessApprovalCommandDTO) {
    const currentUserId = asyncLocalStorage.tryGetUserId();
    if (!currentUserId) {
      throw new UnauthorizedError('User not authenticated');
    }

    return this.requestService.processApproval({
      ...dto,
      reviewedBy: currentUserId,
    });
  }
}
