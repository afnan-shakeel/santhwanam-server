import { DomainEvent } from "@/shared/domain/events/domain-event.base";

export interface MemberRegistrationSubmittedPayload {
  memberId: string;
  memberCode: string;
  approvalRequestId: string;
  unitId: string;
  areaId: string;
  forumId: string;
  agentId: string;
  submittedBy: string;
}

export class MemberRegistrationSubmittedEvent extends DomainEvent {
  static readonly EVENT_TYPE = "member.registration.submitted";

  constructor(
    payload: MemberRegistrationSubmittedPayload,
    userId?: string
  ) {
    super(
      MemberRegistrationSubmittedEvent.EVENT_TYPE,
      payload.memberId,
      "Member",
      payload as unknown as Record<string, unknown>,
      { userId }
    );
  }

  get data(): MemberRegistrationSubmittedPayload {
    return this.payload as unknown as MemberRegistrationSubmittedPayload;
  }
}
