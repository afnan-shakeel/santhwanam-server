import { v4 as uuidv4 } from 'uuid';

export abstract class DomainEvent {
  public readonly eventId: string;
  public readonly occurredAt: Date;
  public readonly version: number = 1;

  constructor(
    public readonly eventType: string,
    public readonly aggregateId: string,
    public readonly aggregateType: string,
    public readonly payload: Record<string, unknown>,
    public readonly metadata?: {
      userId?: string;
      correlationId?: string;
      causationId?: string;
    }
  ) {
    this.eventId = uuidv4();
    this.occurredAt = new Date();
  }
}
