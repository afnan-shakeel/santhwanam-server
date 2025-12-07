import { DomainEvent } from "@/shared/domain/events/domain-event.base";

export interface NomineeRemovedPayload {
  nomineeId: string;
  memberId: string;
  memberCode: string;
}

export class NomineeRemovedEvent extends DomainEvent {
  static readonly EVENT_TYPE = "member.nominee.removed";

  constructor(payload: NomineeRemovedPayload, userId?: string) {
    super(
      NomineeRemovedEvent.EVENT_TYPE,
      payload.memberId,
      "Member",
      payload as unknown as Record<string, unknown>,
      { userId }
    );
  }

  get data(): NomineeRemovedPayload {
    return this.payload as unknown as NomineeRemovedPayload;
  }
}
