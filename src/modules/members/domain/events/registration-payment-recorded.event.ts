import { DomainEvent } from "@/shared/domain/events/domain-event.base";

export interface RegistrationPaymentRecordedPayload {
  paymentId: string;
  memberId: string;
  memberCode: string;
  totalAmount: number;
  registrationFee: number;
  advanceDeposit: number;
  collectedBy: string;
  collectionMode: string;
}

export class RegistrationPaymentRecordedEvent extends DomainEvent {
  static readonly EVENT_TYPE = "member.payment.recorded";

  constructor(
    payload: RegistrationPaymentRecordedPayload,
    userId?: string
  ) {
    super(
      RegistrationPaymentRecordedEvent.EVENT_TYPE,
      payload.memberId,
      "Member",
      payload as unknown as Record<string, unknown>,
      { userId }
    );
  }

  get data(): RegistrationPaymentRecordedPayload {
    return this.payload as unknown as RegistrationPaymentRecordedPayload;
  }
}
