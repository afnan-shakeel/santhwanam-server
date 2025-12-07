import { DomainEvent } from "@/shared/domain/events/domain-event.base";

export interface MemberActivatedPayload {
  memberId: string;
  memberCode: string;
  agentId: string;
  unitId: string;
  areaId: string;
  forumId: string;
  approvedBy: string;
  walletInitialBalance: number;
}

export class MemberActivatedEvent extends DomainEvent {
  static readonly EVENT_TYPE = "member.activated";

  constructor(payload: MemberActivatedPayload, userId?: string) {
    super(
      MemberActivatedEvent.EVENT_TYPE,
      payload.memberId,
      "Member",
      payload as unknown as Record<string, unknown>,
      { userId }
    );
  }

  get data(): MemberActivatedPayload {
    return this.payload as unknown as MemberActivatedPayload;
  }
}
