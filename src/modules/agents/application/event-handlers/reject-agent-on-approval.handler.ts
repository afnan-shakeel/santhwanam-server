import { IEventHandler } from '@/shared/domain/events/event-handler.interface';
import { DomainEvent } from '@/shared/domain/events/domain-event.base';
import { AgentService } from '../agentService';
import { logger } from '@/shared/utils/logger';

/**
 * Handles approval rejection events for agent registration
 */
interface ApprovalRequestRejectedPayload {
  requestId: string;
  workflowCode: string;
  entityType: string;
  entityId: string;
  rejectedBy: string;
  rejectionReason?: string;
  rejectedAt: Date;
}

export class RejectAgentOnApprovalHandler implements IEventHandler<DomainEvent> {
  constructor(private readonly agentService: AgentService) {}

  async handle(event: DomainEvent): Promise<void> {
    const payload = event.payload as unknown as ApprovalRequestRejectedPayload;

    // Only handle agent registration rejections
    if (payload.workflowCode !== 'agent_registration' || payload.entityType !== 'Agent') {
      return;
    }

    const agentId = payload.entityId;
    const rejectedBy = payload.rejectedBy;
    const rejectionReason = payload.rejectionReason;

    logger.info('Rejecting agent registration', {
      agentId,
      rejectedBy,
      rejectionReason,
      eventId: event.eventId
    });

    await this.agentService.handleApprovalRejected(
      agentId,
      rejectedBy,
      rejectionReason
    );

    logger.info('Agent registration rejected successfully', { agentId });
  }
}
