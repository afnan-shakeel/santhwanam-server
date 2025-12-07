import { DomainEvent } from "@/shared/domain/events/domain-event.base";

export interface MemberRegistrationStartedPayload {
  memberId: string;
  memberCode: string;
  unitId: string;
  areaId: string;
  forumId: string;
  agentId: string;
  tierId: string;
  email: string | null;
  firstName: string;
  lastName: string;
  createdBy: string;
}

export class MemberRegistrationStartedEvent extends DomainEvent {
  static readonly EVENT_TYPE = "member.registration.started";

  constructor(
    payload: MemberRegistrationStartedPayload,
    userId?: string
  ) {
    super(
      MemberRegistrationStartedEvent.EVENT_TYPE,
      payload.memberId,
      "Member",
      payload as unknown as Record<string, unknown>,
      { userId }
    );
  }

  get data(): MemberRegistrationStartedPayload {
    return this.payload as unknown as MemberRegistrationStartedPayload;
  }
}
