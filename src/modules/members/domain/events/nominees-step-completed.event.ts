import { DomainEvent } from "@/shared/domain/events/domain-event.base";

export interface NomineesStepCompletedPayload {
  memberId: string;
  memberCode: string;
  nomineeCount: number;
}

export class NomineesStepCompletedEvent extends DomainEvent {
  static readonly EVENT_TYPE = "member.nominees_step.completed";

  constructor(
    payload: NomineesStepCompletedPayload,
    userId?: string
  ) {
    super(
      NomineesStepCompletedEvent.EVENT_TYPE,
      payload.memberId,
      "Member",
      payload as unknown as Record<string, unknown>,
      { userId }
    );
  }

  get data(): NomineesStepCompletedPayload {
    return this.payload as unknown as NomineesStepCompletedPayload;
  }
}
