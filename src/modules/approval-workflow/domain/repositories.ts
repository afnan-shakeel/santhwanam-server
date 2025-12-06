/**
 * Repository interfaces for Approval Workflow
 * Implementations in infrastructure/prisma/
 */

import type {
  ApprovalWorkflow,
  ApprovalStage,
  ApprovalRequest,
  ApprovalStageExecution,
  WorkflowModule,
  ApprovalRequestStatus,
  ApprovalStageStatus,
} from './entities';

export interface ApprovalWorkflowRepository {
  create(
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
  ): Promise<ApprovalWorkflow>;

  findById(workflowId: string, tx?: any): Promise<ApprovalWorkflow | null>;

  findByCode(workflowCode: string, tx?: any): Promise<ApprovalWorkflow | null>;

  update(
    workflowId: string,
    data: {
      workflowName?: string;
      description?: string | null;
      isActive?: boolean;
      requiresAllStages?: boolean;
      updatedBy?: string | null;
    },
    tx?: any
  ): Promise<ApprovalWorkflow>;

  listActive(module?: WorkflowModule, tx?: any): Promise<ApprovalWorkflow[]>;

  listAll(tx?: any): Promise<ApprovalWorkflow[]>;
}

export interface ApprovalStageRepository {
  create(
    data: {
      workflowId: string;
      stageName: string;
      stageOrder: number;
      approverType: string;
      roleId?: string | null;
      userId?: string | null;
      hierarchyLevel?: string | null;
      isOptional?: boolean;
      autoApprove?: boolean;
    },
    tx?: any
  ): Promise<ApprovalStage>;

  createMany(stages: Array<{
    workflowId: string;
    stageName: string;
    stageOrder: number;
    approverType: string;
    roleId?: string | null;
    userId?: string | null;
    hierarchyLevel?: string | null;
    isOptional?: boolean;
    autoApprove?: boolean;
  }>, tx?: any): Promise<void>;

  findByWorkflow(workflowId: string, tx?: any): Promise<ApprovalStage[]>;

  findById(stageId: string, tx?: any): Promise<ApprovalStage | null>;

  deleteByWorkflow(workflowId: string, tx?: any): Promise<void>;
}

export interface ApprovalRequestRepository {
  create(
    data: {
      workflowId: string;
      entityType: string;
      entityId: string;
      forumId?: string | null;
      areaId?: string | null;
      unitId?: string | null;
      requestedBy: string;
      requestedAt: Date;
      currentStageOrder?: number | null;
    },
    tx?: any
  ): Promise<ApprovalRequest>;

  findById(requestId: string, tx?: any): Promise<ApprovalRequest | null>;

  updateStatus(
    requestId: string,
    data: {
      status: ApprovalRequestStatus;
      currentStageOrder?: number | null;
      approvedBy?: string | null;
      approvedAt?: Date | null;
      rejectedBy?: string | null;
      rejectedAt?: Date | null;
      rejectionReason?: string | null;
    },
    tx?: any
  ): Promise<ApprovalRequest>;

  findPendingByEntity(
    entityType: string,
    entityId: string,
    tx?: any
  ): Promise<ApprovalRequest | null>;

  findByRequestedBy(userId: string, tx?: any): Promise<ApprovalRequest[]>;

  findByStatus(status: ApprovalRequestStatus, tx?: any): Promise<ApprovalRequest[]>;
}

export interface ApprovalStageExecutionRepository {
  create(
    data: {
      requestId: string;
      stageId: string;
      stageOrder: number;
      assignedApproverId?: string | null;
    },
    tx?: any
  ): Promise<ApprovalStageExecution>;

  createMany(executions: Array<{
    requestId: string;
    stageId: string;
    stageOrder: number;
    assignedApproverId?: string | null;
  }>, tx?: any): Promise<void>;

  findByRequest(requestId: string, tx?: any): Promise<ApprovalStageExecution[]>;

  findById(executionId: string, tx?: any): Promise<ApprovalStageExecution | null>;

  updateDecision(
    executionId: string,
    data: {
      status: ApprovalStageStatus;
      reviewedBy: string;
      reviewedAt: Date;
      decision: string;
      comments?: string | null;
    },
    tx?: any
  ): Promise<ApprovalStageExecution>;

  findPendingByApprover(approverId: string, tx?: any): Promise<ApprovalStageExecution[]>;

  findByRequestAndStage(
    requestId: string,
    stageOrder: number,
    tx?: any
  ): Promise<ApprovalStageExecution | null>;
}
