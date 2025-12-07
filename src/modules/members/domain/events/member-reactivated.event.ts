import { DomainEvent } from "@/shared/domain/events/domain-event.base";

export interface MemberReactivatedPayload {
  memberId: string;
  memberCode: string;
  agentId: string;
  reactivatedBy: string;
}

export class MemberReactivatedEvent extends DomainEvent {
  static readonly EVENT_TYPE = "member.reactivated";

  constructor(payload: MemberReactivatedPayload, userId?: string) {
    super(
      MemberReactivatedEvent.EVENT_TYPE,
      payload.memberId,
      "Member",
      payload as unknown as Record<string, unknown>,
      { userId }
    );
  }

  get data(): MemberReactivatedPayload {
    return this.payload as unknown as MemberReactivatedPayload;
  }
}
