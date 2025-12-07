import { MemberRepository } from "../../domain/repositories";
import { AgentRepository } from "@/modules/agents/domain/repositories";
import { MemberStatus } from "../../domain/entities";
import { logger } from "@/shared/utils/logger";
import { eventBus } from "@/shared/domain/events/event-bus";
import { MemberAccountClosedEvent } from "../../domain/events";
import prisma from "@/shared/infrastructure/prisma/prismaClient";
import { AppError } from "@/shared/utils/error-handling/AppError";
import { v4 as uuidv4 } from "uuid";

export interface CloseMemberAccountInput {
  memberId: string;
  closureReason: string;
  walletBalanceRefunded: number;
  refundedBy: string;
  closureDate: Date;
}

export class CloseMemberAccountCommand {
  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly agentRepository: AgentRepository
  ) {}

  async execute(input: CloseMemberAccountInput): Promise<void> {
    logger.info("Closing member account", {
      memberId: input.memberId,
      closureReason: input.closureReason,
      refundedBy: input.refundedBy,
    });

    await prisma.$transaction(async (tx: any) => {
      // 1. Get member with wallet
      const member = await this.memberRepository.findById(input.memberId, tx);
      if (!member) {
        throw new AppError("Member not found", 404);
      }

      if (
        member.memberStatus !== MemberStatus.Active &&
        member.memberStatus !== MemberStatus.Suspended
      ) {
        throw new AppError(
          "Can only close active or suspended member accounts",
          400
        );
      }

      // 2. Get wallet and validate balance
      const wallet = await tx.memberWallet.findUnique({
        where: { memberId: input.memberId },
      });

      if (!wallet) {
        throw new AppError("Member wallet not found", 404);
      }

      if (Number(wallet.currentBalance) !== input.walletBalanceRefunded) {
        throw new AppError(
          `Wallet balance mismatch. Expected: ${wallet.currentBalance}, Provided: ${input.walletBalanceRefunded}`,
          400
        );
      }

      // 3. Check for pending contributions
      const pendingContributions = await tx.memberContribution.count({
        where: {
          memberId: input.memberId,
          contributionStatus: { in: ["Pending", "WalletDebitRequested"] },
        },
      });

      if (pendingContributions > 0) {
        throw new AppError(
          "Cannot close account with pending contributions",
          400
        );
      }

      // 4. Update member status to Closed
      await this.memberRepository.update(
        input.memberId,
        {
          memberStatus: MemberStatus.Closed,
        },
        tx
      );

      // 5. Zero out wallet balance
      await tx.memberWallet.update({
        where: { memberId: input.memberId },
        data: {
          currentBalance: 0,
          totalWithdrawn: { increment: input.walletBalanceRefunded },
          lastTransactionAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // 6. Create GL entry for refund
      if (input.walletBalanceRefunded > 0) {
        await tx.generalLedgerEntry.create({
          data: {
            entryId: uuidv4(),
            entryDate: new Date(),
            effectiveDate: input.closureDate,
            description: `Member Account Closure - ${member.memberCode}`,
            referenceNumber: member.memberCode,
            sourceModule: "Membership",
            sourceEntityType: "Member",
            sourceEntityId: input.memberId,
            sourceTransactionType: "AccountClosure",
            fiscalYear: new Date().getFullYear(),
            fiscalPeriod: new Date().getMonth() + 1,
            isPosted: true,
            postedBy: input.refundedBy,
            postedAt: new Date(),
            createdBy: input.refundedBy,
            createdAt: new Date(),
            updatedAt: new Date(),
            lineItems: {
              create: [
                {
                  lineItemId: uuidv4(),
                  accountCode: "2100", // Member Wallet Liability
                  debitAmount: input.walletBalanceRefunded,
                  creditAmount: 0,
                  description: "Wallet balance refund on account closure",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
                {
                  lineItemId: uuidv4(),
                  accountCode: "1000", // Cash
                  debitAmount: 0,
                  creditAmount: input.walletBalanceRefunded,
                  description: "Cash refunded to member",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              ],
            },
          },
        });
      }

      // 7. Update agent statistics if member was active
      if (member.memberStatus === MemberStatus.Active) {
        await tx.agent.update({
          where: { agentId: member.agentId },
          data: {
            totalActiveMembers: { decrement: 1 },
            updatedAt: new Date(),
          },
        });
      }

      // 8. Publish MemberAccountClosed event
      await eventBus.publish(
        new MemberAccountClosedEvent(
          {
            memberId: member.memberId,
            memberCode: member.memberCode,
            agentId: member.agentId,
            closureReason: input.closureReason,
            walletBalanceRefunded: input.walletBalanceRefunded,
            closedBy: input.refundedBy,
          },
          input.refundedBy
        )
      );

      logger.info("Member account closed successfully", {
        memberId: input.memberId,
        memberCode: member.memberCode,
        refundAmount: input.walletBalanceRefunded,
      });
    });
  }
}
