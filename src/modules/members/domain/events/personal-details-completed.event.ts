import { DomainEvent } from "@/shared/domain/events/domain-event.base";

export interface PersonalDetailsCompletedPayload {
  memberId: string;
  memberCode: string;
}

export class PersonalDetailsCompletedEvent extends DomainEvent {
  static readonly EVENT_TYPE = "member.personal_details.completed";

  constructor(
    payload: PersonalDetailsCompletedPayload,
    userId?: string
  ) {
    super(
      PersonalDetailsCompletedEvent.EVENT_TYPE,
      payload.memberId,
      "Member",
      payload as unknown as Record<string, unknown>,
      { userId }
    );
  }

  get data(): PersonalDetailsCompletedPayload {
    return this.payload as unknown as PersonalDetailsCompletedPayload;
  }
}
