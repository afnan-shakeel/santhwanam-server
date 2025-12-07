import { DomainEvent } from "@/shared/domain/events/domain-event.base";

export interface MemberDraftSavedPayload {
  memberId: string;
  memberCode: string;
  step: string;
}

export class MemberDraftSavedEvent extends DomainEvent {
  static readonly EVENT_TYPE = "member.draft.saved";

  constructor(payload: MemberDraftSavedPayload, userId?: string) {
    super(
      MemberDraftSavedEvent.EVENT_TYPE,
      payload.memberId,
      "Member",
      payload as unknown as Record<string, unknown>,
      { userId }
    );
  }

  get data(): MemberDraftSavedPayload {
    return this.payload as unknown as MemberDraftSavedPayload;
  }
}
