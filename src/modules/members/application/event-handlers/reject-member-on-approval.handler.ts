import { IEventHandler } from "@/shared/domain/events/event-handler.interface";
import { DomainEvent } from "@/shared/domain/events/domain-event.base";
import { MemberRepository } from "../../domain/repositories";
import { RegistrationPaymentRepository } from "../../domain/repositories";
import { RegistrationStatus, PaymentApprovalStatus } from "../../domain/entities";
import { logger } from "@/shared/utils/logger";
import { eventBus } from "@/shared/domain/events/event-bus";
import { MemberRegistrationRejectedEvent } from "../../domain/events";
import prisma from "@/shared/infrastructure/prisma/prismaClient";

/**
 * Handles approval rejection events for member registration
 */
interface ApprovalRequestRejectedPayload {
  requestId: string;
  workflowCode: string;
  entityType: string;
  entityId: string;
  rejectedBy: string;
  rejectionReason?: string;
  rejectedAt: Date;
}

export class RejectMemberOnApprovalHandler implements IEventHandler<DomainEvent> {
  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly registrationPaymentRepository: RegistrationPaymentRepository
  ) {}

  async handle(event: DomainEvent): Promise<void> {
    const payload = event.payload as unknown as ApprovalRequestRejectedPayload;

    // Only handle member registration rejections
    if (payload.workflowCode !== "member_registration" || payload.entityType !== "Member") {
      return;
    }

    const memberId = payload.entityId;
    const rejectedBy = payload.rejectedBy;
    const rejectionReason = payload.rejectionReason;

    logger.info("Rejecting member registration", {
      memberId,
      rejectedBy,
      rejectionReason,
      eventId: event.eventId,
    });

    await prisma.$transaction(async (tx: any) => {
      // 1. Get member
      const member = await this.memberRepository.findById(memberId, tx);
      if (!member) {
        logger.error("Member not found for rejection", { memberId });
        throw new Error("Member not found");
      }

      // 2. Update member status to Rejected
      logger.info("Updating member status to Rejected", { memberId });
      await this.memberRepository.update(
        memberId,
        {
          registrationStatus: RegistrationStatus.Rejected,
        },
        tx
      );

      // 3. Get and update payment status
      const payment = await this.registrationPaymentRepository.findByMemberId(memberId, tx);
      if (payment) {
        logger.info("Marking payment as rejected", { paymentId: payment.paymentId });
        await this.registrationPaymentRepository.update(
          payment.paymentId,
          {
            approvalStatus: PaymentApprovalStatus.Rejected,
            rejectionReason,
          },
          tx
        );
      }

      // 4. Publish MemberRegistrationRejected event
      await eventBus.publish(
        new MemberRegistrationRejectedEvent(
          {
            memberId: member.memberId,
            memberCode: member.memberCode,
            agentId: member.agentId,
            rejectedBy,
            rejectionReason: rejectionReason || "Registration not approved",
            paymentAmount: payment?.totalAmount || 0,
          },
          rejectedBy
        )
      );

      logger.info("Member registration rejected successfully", {
        memberId,
        memberCode: member.memberCode,
      });
    });
  }
}
