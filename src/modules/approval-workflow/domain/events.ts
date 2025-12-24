import { DomainEvent } from '@/shared/domain/events/domain-event.base';

export interface ApprovalRequestApprovedPayload {
  requestId: string;
  workflowCode: string;
  entityType: string;
  entityId: string;
  approvedBy: string;
  approvedAt: Date;
}

export class ApprovalRequestApprovedEvent extends DomainEvent {
  static readonly EVENT_TYPE = 'approval.request.approved';

  constructor(payload: ApprovalRequestApprovedPayload, userId?: string) {
    super(
      ApprovalRequestApprovedEvent.EVENT_TYPE,
      payload.requestId,
      'ApprovalRequest',
      payload as unknown as Record<string, unknown>,
      { userId }
    );
  }

  get data(): ApprovalRequestApprovedPayload {
    return this.payload as unknown as ApprovalRequestApprovedPayload;
  }
}

export interface ApprovalRequestRejectedPayload {
  requestId: string;
  workflowCode: string;
  entityType: string;
  entityId: string;
  rejectedBy: string;
  rejectedAt: Date;
  rejectionReason: string | null;
}

export class ApprovalRequestRejectedEvent extends DomainEvent {
  static readonly EVENT_TYPE = 'approval.request.rejected';

  constructor(payload: ApprovalRequestRejectedPayload, userId?: string) {
    super(
      ApprovalRequestRejectedEvent.EVENT_TYPE,
      payload.requestId,
      'ApprovalRequest',
      payload as unknown as Record<string, unknown>,
      { userId }
    );
  }

  get data(): ApprovalRequestRejectedPayload {
    return this.payload as unknown as ApprovalRequestRejectedPayload;
  }
}
