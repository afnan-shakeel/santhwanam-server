import { DomainEvent } from '@/shared/domain/events/domain-event.base';

export interface AgentRegistrationStartedPayload {
  agentId: string;
  agentCode: string;
  unitId: string;
  areaId: string;
  forumId: string;
  email: string;
  firstName: string;
  lastName: string;
  createdBy: string;
}

export class AgentRegistrationStartedEvent extends DomainEvent {
  static readonly EVENT_TYPE = 'agent.registration.started';

  constructor(payload: AgentRegistrationStartedPayload, userId?: string) {
    super(
      AgentRegistrationStartedEvent.EVENT_TYPE,
      payload.agentId,
      'Agent',
      payload as unknown as Record<string, unknown>,
      { userId }
    );
  }

  get data(): AgentRegistrationStartedPayload {
    return this.payload as unknown as AgentRegistrationStartedPayload;
  }
}
