import { DomainEvent } from "@/shared/domain/events/domain-event.base";

export interface MemberRegistrationRejectedPayload {
  memberId: string;
  memberCode: string;
  agentId: string;
  rejectedBy: string;
  rejectionReason: string;
  paymentAmount: number;
}

export class MemberRegistrationRejectedEvent extends DomainEvent {
  static readonly EVENT_TYPE = "member.registration.rejected";

  constructor(payload: MemberRegistrationRejectedPayload, userId?: string) {
    super(
      MemberRegistrationRejectedEvent.EVENT_TYPE,
      payload.memberId,
      "Member",
      payload as unknown as Record<string, unknown>,
      { userId }
    );
  }

  get data(): MemberRegistrationRejectedPayload {
    return this.payload as unknown as MemberRegistrationRejectedPayload;
  }
}
