import { DomainEvent } from '@/shared/domain/events/domain-event.base';

export interface AgentActivatedPayload {
  agentId: string;
  agentCode: string;
  userId: string;
  unitId: string;
  areaId: string;
  forumId: string;
  email: string;
  approvedBy: string;
  invitationSent: boolean;
}

export class AgentActivatedEvent extends DomainEvent {
  static readonly EVENT_TYPE = 'agent.activated';

  constructor(payload: AgentActivatedPayload, userId?: string) {
    super(
      AgentActivatedEvent.EVENT_TYPE,
      payload.agentId,
      'Agent',
      payload as unknown as Record<string, unknown>,
      { userId }
    );
  }

  get data(): AgentActivatedPayload {
    return this.payload as unknown as AgentActivatedPayload;
  }
}
