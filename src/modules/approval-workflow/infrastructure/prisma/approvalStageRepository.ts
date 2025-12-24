/**
 * Prisma implementation of ApprovalStageRepository
 */

import type { ApprovalStageRepository } from '../../domain/repositories';
import type { ApprovalStage } from '../../domain/entities';
import prisma from '@/shared/infrastructure/prisma/prismaClient';

export class PrismaApprovalStageRepository implements ApprovalStageRepository {

  async create(
    data: {
      workflowId: string;
      stageName: string;
      stageOrder: number;
      approverType: string;
      roleId?: string | null;
      userId?: string | null;
      organizationBody?: string | null;
      isOptional?: boolean;
      autoApprove?: boolean;
    },
    tx?: any
  ): Promise<ApprovalStage> {
    const client = tx ?? prisma;
    return client.approvalStage.create({
      data: {
        workflowId: data.workflowId,
        stageName: data.stageName,
        stageOrder: data.stageOrder,
        approverType: data.approverType,
        roleId: data.roleId,
        userId: data.userId,
        organizationBody: data.organizationBody,
        isOptional: data.isOptional ?? false,
        autoApprove: data.autoApprove ?? false,
      },
    });
  }

  async createMany(stages: Array<{
    workflowId: string;
    stageName: string;
    stageOrder: number;
    approverType: string;
    roleId?: string | null;
    userId?: string | null;
    organizationBody?: string | null;
    isOptional?: boolean;
    autoApprove?: boolean;
  }>, tx?: any): Promise<void> {
    const client = tx ?? prisma;
    await client.approvalStage.createMany({
      data: stages.map(stage => ({
        workflowId: stage.workflowId,
        stageName: stage.stageName,
        stageOrder: stage.stageOrder,
        approverType: stage.approverType,
        roleId: stage.roleId,
        userId: stage.userId,
        organizationBody: stage.organizationBody,
        isOptional: stage.isOptional ?? false,
        autoApprove: stage.autoApprove ?? false,
      })),
    });
  }

  async findByWorkflow(workflowId: string, tx?: any): Promise<ApprovalStage[]> {
    const client = tx ?? prisma;
    return client.approvalStage.findMany({
      where: { workflowId },
      orderBy: { stageOrder: 'asc' },
    });
  }

  async findById(stageId: string, tx?: any): Promise<ApprovalStage | null> {
    const client = tx ?? prisma;
    return client.approvalStage.findUnique({
      where: { stageId },
    });
  }

  async update(
    stageId: string,
    data: {
      stageName?: string;
      stageOrder?: number;
      approverType?: string;
      roleId?: string | null;
      userId?: string | null;
      organizationBody?: string | null;
      isOptional?: boolean;
      autoApprove?: boolean;
      updatedBy?: string | null;
    },
    tx?: any
  ): Promise<ApprovalStage> {
    const client = tx ?? prisma;
    return client.approvalStage.update({
      where: { stageId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  async deleteByWorkflow(workflowId: string, tx?: any): Promise<void> {
    const client = tx ?? prisma;
    await client.approvalStage.deleteMany({
      where: { workflowId },
    });
  }

  async deleteByIds(stageIds: string[], tx?: any): Promise<void> {
    const client = tx ?? prisma;
    await client.approvalStage.deleteMany({
      where: {
        stageId: { in: stageIds },
      },
    });
  }

  async countExecutionsByStageId(stageId: string, tx?: any): Promise<number> {
    const client = tx ?? prisma;
    return client.approvalStageExecution.count({
      where: { stageId },
    });
  }
}
