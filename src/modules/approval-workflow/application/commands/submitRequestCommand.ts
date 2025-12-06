/**
 * Command: Submit Approval Request
 * Creates approval request with stage executions
 */

import type { ApprovalRequestService } from '../approvalRequestService';
import { asyncLocalStorage } from '@/shared/infrastructure/context/AsyncLocalStorageManager';
import { UnauthorizedError } from '@/shared/utils/error-handling/httpErrors';

export interface SubmitRequestCommandDTO {
  workflowCode: string;
  entityType: string;
  entityId: string;
  forumId?: string | null;
  areaId?: string | null;
  unitId?: string | null;
}

export class SubmitRequestCommand {
  constructor(private readonly requestService: ApprovalRequestService) {}

  async execute(dto: SubmitRequestCommandDTO) {
    const currentUserId = asyncLocalStorage.tryGetUserId();
    if (!currentUserId) {
      throw new UnauthorizedError('User not authenticated');
    }

    return this.requestService.submitRequest({
      ...dto,
      requestedBy: currentUserId,
    });
  }
}
