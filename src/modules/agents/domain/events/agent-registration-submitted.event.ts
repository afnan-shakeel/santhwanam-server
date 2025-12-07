import { DomainEvent } from '@/shared/domain/events/domain-event.base';

export interface AgentRegistrationSubmittedPayload {
  agentId: string;
  agentCode: string;
  approvalRequestId: string;
  unitId: string;
  areaId: string;
  forumId: string;
  email: string;
  submittedBy: string;
}

export class AgentRegistrationSubmittedEvent extends DomainEvent {
  static readonly EVENT_TYPE = 'agent.registration.submitted';

  constructor(payload: AgentRegistrationSubmittedPayload, userId?: string) {
    super(
      AgentRegistrationSubmittedEvent.EVENT_TYPE,
      payload.agentId,
      'Agent',
      payload as unknown as Record<string, unknown>,
      { userId }
    );
  }

  get data(): AgentRegistrationSubmittedPayload {
    return this.payload as unknown as AgentRegistrationSubmittedPayload;
  }
}
