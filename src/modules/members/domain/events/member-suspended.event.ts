import { DomainEvent } from "@/shared/domain/events/domain-event.base";

export interface MemberSuspendedPayload {
  memberId: string;
  memberCode: string;
  agentId: string;
  reason: string;
  suspendedBy: string;
}

export class MemberSuspendedEvent extends DomainEvent {
  static readonly EVENT_TYPE = "member.suspended";

  constructor(payload: MemberSuspendedPayload, userId?: string) {
    super(
      MemberSuspendedEvent.EVENT_TYPE,
      payload.memberId,
      "Member",
      payload as unknown as Record<string, unknown>,
      { userId }
    );
  }

  get data(): MemberSuspendedPayload {
    return this.payload as unknown as MemberSuspendedPayload;
  }
}
