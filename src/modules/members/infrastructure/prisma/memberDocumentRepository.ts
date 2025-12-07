// Infrastructure: Prisma implementation of MemberDocumentRepository

import { MemberDocument } from "../../domain/entities";
import { MemberDocumentRepository } from "../../domain/repositories";
import prisma from "@/shared/infrastructure/prisma/prismaClient";

export class PrismaMemberDocumentRepository
  implements MemberDocumentRepository
{
  async create(
    document: Omit<MemberDocument, "createdAt" | "updatedAt">,
    tx?: any
  ): Promise<MemberDocument> {
    const db = tx || prisma;
    const created = await db.memberDocument.create({
      data: {
        documentId: document.documentId,
        memberId: document.memberId,
        nomineeId: document.nomineeId,
        documentType: document.documentType,
        documentCategory: document.documentCategory,
        documentName: document.documentName,
        fileUrl: document.fileUrl,
        fileSize: document.fileSize,
        mimeType: document.mimeType,
        uploadedBy: document.uploadedBy,
        uploadedAt: document.uploadedAt,
        verificationStatus: document.verificationStatus,
        verifiedBy: document.verifiedBy,
        verifiedAt: document.verifiedAt,
        rejectionReason: document.rejectionReason,
        expiryDate: document.expiryDate,
        isActive: document.isActive,
      },
    });

    return this.toDomain(created);
  }

  async findById(documentId: string, tx?: any): Promise<MemberDocument | null> {
    const db = tx || prisma;
    const document = await db.memberDocument.findUnique({
      where: { documentId },
    });
    return document ? this.toDomain(document) : null;
  }

  async findByMemberId(memberId: string, tx?: any): Promise<MemberDocument[]> {
    const db = tx || prisma;
    const documents = await db.memberDocument.findMany({
      where: { memberId },
    });
    return documents.map((d: any) => this.toDomain(d));
  }

  async findActiveByMemberId(memberId: string, tx?: any): Promise<MemberDocument[]> {
    const db = tx || prisma;
    const documents = await db.memberDocument.findMany({
      where: { memberId, isActive: true },
    });
    return documents.map((d: any) => this.toDomain(d));
  }

  async findByMemberAndCategory(
    memberId: string,
    category: string,
    tx?: any
  ): Promise<MemberDocument[]> {
    const db = tx || prisma;
    const documents = await db.memberDocument.findMany({
      where: { memberId, documentCategory: category as any },
    });
    return documents.map((d: any) => this.toDomain(d));
  }

  async findActiveByMemberAndCategory(
    memberId: string,
    category: string,
    tx?: any
  ): Promise<MemberDocument[]> {
    const db = tx || prisma;
    const documents = await db.memberDocument.findMany({
      where: {
        memberId,
        documentCategory: category as any,
        isActive: true,
      },
    });
    return documents.map((d: any) => this.toDomain(d));
  }

  async findByNomineeId(nomineeId: string, tx?: any): Promise<MemberDocument[]> {
    const db = tx || prisma;
    const documents = await db.memberDocument.findMany({
      where: { nomineeId },
    });
    return documents.map((d: any) => this.toDomain(d));
  }

  async update(
    documentId: string,
    data: Partial<
      Omit<MemberDocument, "documentId" | "memberId" | "createdAt">
    >,
    tx?: any
  ): Promise<MemberDocument> {
    const db = tx || prisma;
    const document = await db.memberDocument.update({
      where: { documentId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return this.toDomain(document);
  }

  async softDelete(documentId: string, tx?: any): Promise<void> {
    const db = tx || prisma;
    await db.memberDocument.update({
      where: { documentId },
      data: { isActive: false, updatedAt: new Date() },
    });
  }

  async softDeleteByNomineeId(nomineeId: string, tx?: any): Promise<void> {
    const db = tx || prisma;
    await db.memberDocument.updateMany({
      where: { nomineeId },
      data: { isActive: false, updatedAt: new Date() },
    });
  }

  private toDomain(prismaData: any): MemberDocument {
    return {
      documentId: prismaData.documentId,
      memberId: prismaData.memberId,
      nomineeId: prismaData.nomineeId,
      documentType: prismaData.documentType,
      documentCategory: prismaData.documentCategory,
      documentName: prismaData.documentName,
      fileUrl: prismaData.fileUrl,
      fileSize: prismaData.fileSize,
      mimeType: prismaData.mimeType,
      uploadedBy: prismaData.uploadedBy,
      uploadedAt: prismaData.uploadedAt,
      verificationStatus: prismaData.verificationStatus,
      verifiedBy: prismaData.verifiedBy,
      verifiedAt: prismaData.verifiedAt,
      rejectionReason: prismaData.rejectionReason,
      expiryDate: prismaData.expiryDate,
      isActive: prismaData.isActive,
      createdAt: prismaData.createdAt,
      updatedAt: prismaData.updatedAt,
    };
  }
}
