import { DomainEvent } from "@/shared/domain/events/domain-event.base";

export interface MemberDocumentRemovedPayload {
  documentId: string;
  memberId: string;
  memberCode: string;
  documentCategory: string;
}

export class MemberDocumentRemovedEvent extends DomainEvent {
  static readonly EVENT_TYPE = "member.document.removed";

  constructor(
    payload: MemberDocumentRemovedPayload,
    userId?: string
  ) {
    super(
      MemberDocumentRemovedEvent.EVENT_TYPE,
      payload.memberId,
      "Member",
      payload as unknown as Record<string, unknown>,
      { userId }
    );
  }

  get data(): MemberDocumentRemovedPayload {
    return this.payload as unknown as MemberDocumentRemovedPayload;
  }
}
