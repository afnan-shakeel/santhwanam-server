/**
 * Domain entities for Approval Workflow
 * See docs/domain/2.approval_workflow.md
 */

export enum WorkflowModule {
  Membership = 'Membership',
  Wallet = 'Wallet',
  Claims = 'Claims',
  Contributions = 'Contributions',
  Organization = 'Organization',
}

export enum ApproverType {
  Role = 'Role',
  SpecificUser = 'SpecificUser',
  Hierarchy = 'Hierarchy',
}

export enum HierarchyLevel {
  Unit = 'Unit',
  Area = 'Area',
  Forum = 'Forum',
}

export enum ApprovalRequestStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
  Cancelled = 'Cancelled',
}

export enum ApprovalStageStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
  Skipped = 'Skipped',
}

export enum ApprovalDecision {
  Approve = 'Approve',
  Reject = 'Reject',
}

export interface ApprovalWorkflow {
  workflowId: string;
  workflowCode: string;
  workflowName: string;
  description?: string | null;
  module: WorkflowModule;
  entityType: string;
  isActive: boolean;
  requiresAllStages: boolean;
  createdAt: Date;
  createdBy?: string | null;
  updatedAt?: Date | null;
  updatedBy?: string | null;
}

export interface ApprovalStage {
  stageId: string;
  workflowId: string;
  stageName: string;
  stageOrder: number;
  approverType: ApproverType;
  roleId?: string | null;
  userId?: string | null;
  hierarchyLevel?: HierarchyLevel | null;
  isOptional: boolean;
  autoApprove: boolean;
  createdAt: Date;
}

export interface ApprovalRequest {
  requestId: string;
  workflowId: string;
  entityType: string;
  entityId: string;
  forumId?: string | null;
  areaId?: string | null;
  unitId?: string | null;
  requestedBy: string;
  requestedAt: Date;
  status: ApprovalRequestStatus;
  currentStageOrder?: number | null;
  approvedBy?: string | null;
  approvedAt?: Date | null;
  rejectedBy?: string | null;
  rejectedAt?: Date | null;
  rejectionReason?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
}

export interface ApprovalStageExecution {
  executionId: string;
  requestId: string;
  stageId: string;
  stageOrder: number;
  status: ApprovalStageStatus;
  assignedApproverId?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: Date | null;
  decision?: ApprovalDecision | null;
  comments?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
}
