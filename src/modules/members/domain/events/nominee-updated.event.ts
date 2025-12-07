import { DomainEvent } from "@/shared/domain/events/domain-event.base";

export interface NomineeUpdatedPayload {
  nomineeId: string;
  memberId: string;
  memberCode: string;
  nomineeName: string;
}

export class NomineeUpdatedEvent extends DomainEvent {
  static readonly EVENT_TYPE = "member.nominee.updated";

  constructor(payload: NomineeUpdatedPayload, userId?: string) {
    super(
      NomineeUpdatedEvent.EVENT_TYPE,
      payload.memberId,
      "Member",
      payload as unknown as Record<string, unknown>,
      { userId }
    );
  }

  get data(): NomineeUpdatedPayload {
    return this.payload as unknown as NomineeUpdatedPayload;
  }
}
