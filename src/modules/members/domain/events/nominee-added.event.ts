import { DomainEvent } from "@/shared/domain/events/domain-event.base";

export interface NomineeAddedPayload {
  nomineeId: string;
  memberId: string;
  memberCode: string;
  nomineeName: string;
  relationType: string;
}

export class NomineeAddedEvent extends DomainEvent {
  static readonly EVENT_TYPE = "member.nominee.added";

  constructor(payload: NomineeAddedPayload, userId?: string) {
    super(
      NomineeAddedEvent.EVENT_TYPE,
      payload.memberId,
      "Member",
      payload as unknown as Record<string, unknown>,
      { userId }
    );
  }

  get data(): NomineeAddedPayload {
    return this.payload as unknown as NomineeAddedPayload;
  }
}
