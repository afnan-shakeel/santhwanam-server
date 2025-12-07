import { DomainEvent } from '@/shared/domain/events/domain-event.base';

export interface AgentUpdatedPayload {
  agentId: string;
  agentCode: string;
  updatedBy: string;
  updatedFields: string[];
}

export class AgentUpdatedEvent extends DomainEvent {
  static readonly EVENT_TYPE = 'agent.updated';

  constructor(payload: AgentUpdatedPayload, userId?: string) {
    super(
      AgentUpdatedEvent.EVENT_TYPE,
      payload.agentId,
      'Agent',
      payload as unknown as Record<string, unknown>,
      { userId }
    );
  }

  get data(): AgentUpdatedPayload {
    return this.payload as unknown as AgentUpdatedPayload;
  }
}
