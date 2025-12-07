import { DomainEvent } from "@/shared/domain/events/domain-event.base";

export interface MemberAccountClosedPayload {
  memberId: string;
  memberCode: string;
  agentId: string;
  closureReason: string;
  walletBalanceRefunded: number;
  closedBy: string;
}

export class MemberAccountClosedEvent extends DomainEvent {
  static readonly EVENT_TYPE = "member.account.closed";

  constructor(payload: MemberAccountClosedPayload, userId?: string) {
    super(
      MemberAccountClosedEvent.EVENT_TYPE,
      payload.memberId,
      "Member",
      payload as unknown as Record<string, unknown>,
      { userId }
    );
  }

  get data(): MemberAccountClosedPayload {
    return this.payload as unknown as MemberAccountClosedPayload;
  }
}
