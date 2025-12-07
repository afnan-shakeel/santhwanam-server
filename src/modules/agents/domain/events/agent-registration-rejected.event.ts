import { DomainEvent } from '@/shared/domain/events/domain-event.base';

export interface AgentRegistrationRejectedPayload {
  agentId: string;
  agentCode: string;
  rejectedBy: string;
  rejectionReason?: string;
}

export class AgentRegistrationRejectedEvent extends DomainEvent {
  static readonly EVENT_TYPE = 'agent.registration.rejected';

  constructor(payload: AgentRegistrationRejectedPayload, userId?: string) {
    super(
      AgentRegistrationRejectedEvent.EVENT_TYPE,
      payload.agentId,
      'Agent',
      payload as unknown as Record<string, unknown>,
      { userId }
    );
  }

  get data(): AgentRegistrationRejectedPayload {
    return this.payload as unknown as AgentRegistrationRejectedPayload;
  }
}
