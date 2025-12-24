/**
 * Prisma implementation of ApprovalWorkflowRepository
 */

import type { ApprovalWorkflowRepository } from '../../domain/repositories';
import type { ApprovalWorkflow, WorkflowModule } from '../../domain/entities';
import prisma from '@/shared/infrastructure/prisma/prismaClient';
import { includes } from 'zod';

export class PrismaApprovalWorkflowRepository implements ApprovalWorkflowRepository {

  async create(
    data: {
      workflowCode: string;
      workflowName: string;
      description?: string | null;
      module: WorkflowModule;
      entityType: string;
      isActive?: boolean;
      requiresAllStages?: boolean;
      createdBy?: string | null;
    },
    tx?: any
  ): Promise<ApprovalWorkflow> {
    const client = tx ?? prisma;
    return client.approvalWorkflow.create({
      data: {
        workflowCode: data.workflowCode,
        workflowName: data.workflowName,
        description: data.description,
        module: data.module,
        entityType: data.entityType,
        isActive: data.isActive ?? true,
        requiresAllStages: data.requiresAllStages ?? true,
        createdBy: data.createdBy,
      },
    });
  }

  async findById(workflowId: string, tx?: any): Promise<ApprovalWorkflow | null> {
    const client = tx ?? prisma;
    return client.approvalWorkflow.findUnique({
      where: { workflowId },
      include: { stages: true },
    });
  }

  async findByCode(workflowCode: string, tx?: any): Promise<ApprovalWorkflow | null> {
    const client = tx ?? prisma;
    return client.approvalWorkflow.findUnique({
      where: { workflowCode },
    });
  }

  async update(
    workflowId: string,
    data: {
      workflowName?: string;
      description?: string | null;
      isActive?: boolean;
      requiresAllStages?: boolean;
      updatedBy?: string | null;
    },
    tx?: any
  ): Promise<ApprovalWorkflow> {
    const client = tx ?? prisma;
    return client.approvalWorkflow.update({
      where: { workflowId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  async listActive(module?: WorkflowModule, tx?: any): Promise<ApprovalWorkflow[]> {
    const client = tx ?? prisma;
    return client.approvalWorkflow.findMany({
      where: {
        isActive: true,
        ...(module && { module }),
      },
      orderBy: { workflowName: 'asc' },
    });
  }

  async listAll(tx?: any): Promise<ApprovalWorkflow[]> {
    const client = tx ?? prisma;
    return client.approvalWorkflow.findMany({
      orderBy: { workflowName: 'asc' },
    });
  }
}
