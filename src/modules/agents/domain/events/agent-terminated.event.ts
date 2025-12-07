import { DomainEvent } from '@/shared/domain/events/domain-event.base';

export interface AgentTerminatedPayload {
  agentId: string;
  agentCode: string;
  terminationReason: string;
  terminatedBy: string;
  terminatedDate: Date;
}

export class AgentTerminatedEvent extends DomainEvent {
  static readonly EVENT_TYPE = 'agent.terminated';

  constructor(payload: AgentTerminatedPayload, userId?: string) {
    super(
      AgentTerminatedEvent.EVENT_TYPE,
      payload.agentId,
      'Agent',
      payload as unknown as Record<string, unknown>,
      { userId }
    );
  }

  get data(): AgentTerminatedPayload {
    return this.payload as unknown as AgentTerminatedPayload;
  }
}
