import { DomainEvent } from '@/shared/domain/events/domain-event.base';

export interface AgentDraftUpdatedPayload {
  agentId: string;
  agentCode: string;
  updatedBy: string;
  updatedFields: string[];
}

export class AgentDraftUpdatedEvent extends DomainEvent {
  static readonly EVENT_TYPE = 'agent.draft.updated';

  constructor(payload: AgentDraftUpdatedPayload, userId?: string) {
    super(
      AgentDraftUpdatedEvent.EVENT_TYPE,
      payload.agentId,
      'Agent',
      payload as unknown as Record<string, unknown>,
      { userId }
    );
  }

  get data(): AgentDraftUpdatedPayload {
    return this.payload as unknown as AgentDraftUpdatedPayload;
  }
}
