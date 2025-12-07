import { DomainEvent } from "@/shared/domain/events/domain-event.base";

export interface MemberDocumentUploadedPayload {
  documentId: string;
  memberId: string;
  memberCode: string;
  nomineeId: string | null;
  documentCategory: string;
  documentType: string;
  documentName: string;
  uploadedBy: string;
}

export class MemberDocumentUploadedEvent extends DomainEvent {
  static readonly EVENT_TYPE = "member.document.uploaded";

  constructor(
    payload: MemberDocumentUploadedPayload,
    userId?: string
  ) {
    super(
      MemberDocumentUploadedEvent.EVENT_TYPE,
      payload.memberId,
      "Member",
      payload as unknown as Record<string, unknown>,
      { userId }
    );
  }

  get data(): MemberDocumentUploadedPayload {
    return this.payload as unknown as MemberDocumentUploadedPayload;
  }
}
