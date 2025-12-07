// Infrastructure: Prisma implementation of RegistrationPaymentRepository

import { RegistrationPayment } from "../../domain/entities";
import { RegistrationPaymentRepository } from "../../domain/repositories";
import prisma from "@/shared/infrastructure/prisma/prismaClient";
import { Prisma } from "@/generated/prisma/client";

export class PrismaRegistrationPaymentRepository
  implements RegistrationPaymentRepository
{
  async create(
    payment: Omit<RegistrationPayment, "createdAt" | "updatedAt">,
    tx?: any
  ): Promise<RegistrationPayment> {
    const db = tx || prisma;
    const created = await db.registrationPayment.create({
      data: {
        paymentId: payment.paymentId,
        memberId: payment.memberId,
        registrationFee: new Prisma.Decimal(payment.registrationFee),
        advanceDeposit: new Prisma.Decimal(payment.advanceDeposit),
        totalAmount: new Prisma.Decimal(payment.totalAmount),
        collectedBy: payment.collectedBy,
        collectionDate: payment.collectionDate,
        collectionMode: payment.collectionMode,
        referenceNumber: payment.referenceNumber,
        approvalStatus: payment.approvalStatus,
        approvedBy: payment.approvedBy,
        approvedAt: payment.approvedAt,
        rejectionReason: payment.rejectionReason,
      },
    });

    return this.toDomain(created);
  }

  async findById(paymentId: string, tx?: any): Promise<RegistrationPayment | null> {
    const db = tx || prisma;
    const payment = await db.registrationPayment.findUnique({
      where: { paymentId },
    });
    return payment ? this.toDomain(payment) : null;
  }

  async findByMemberId(memberId: string, tx?: any): Promise<RegistrationPayment | null> {
    const db = tx || prisma;
    const payment = await db.registrationPayment.findUnique({
      where: { memberId },
    });
    return payment ? this.toDomain(payment) : null;
  }

  async update(
    paymentId: string,
    data: Partial<
      Omit<RegistrationPayment, "paymentId" | "memberId" | "createdAt">
    >,
    tx?: any
  ): Promise<RegistrationPayment> {
    const db = tx || prisma;
    const updateData: any = {
      ...data,
      updatedAt: new Date(),
    };

    // Convert numbers to Decimal for Prisma
    if (data.registrationFee !== undefined) {
      updateData.registrationFee = new Prisma.Decimal(data.registrationFee);
    }
    if (data.advanceDeposit !== undefined) {
      updateData.advanceDeposit = new Prisma.Decimal(data.advanceDeposit);
    }
    if (data.totalAmount !== undefined) {
      updateData.totalAmount = new Prisma.Decimal(data.totalAmount);
    }

    const payment = await db.registrationPayment.update({
      where: { paymentId },
      data: updateData,
    });

    return this.toDomain(payment);
  }

  private toDomain(prismaData: any): RegistrationPayment {
    return {
      paymentId: prismaData.paymentId,
      memberId: prismaData.memberId,
      registrationFee: Number(prismaData.registrationFee),
      advanceDeposit: Number(prismaData.advanceDeposit),
      totalAmount: Number(prismaData.totalAmount),
      collectedBy: prismaData.collectedBy,
      collectionDate: prismaData.collectionDate,
      collectionMode: prismaData.collectionMode,
      referenceNumber: prismaData.referenceNumber,
      approvalStatus: prismaData.approvalStatus,
      approvedBy: prismaData.approvedBy,
      approvedAt: prismaData.approvedAt,
      rejectionReason: prismaData.rejectionReason,
      createdAt: prismaData.createdAt,
      updatedAt: prismaData.updatedAt,
    };
  }
}
