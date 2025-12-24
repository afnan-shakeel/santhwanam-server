import { z } from 'zod'
import ApprovalWorkflowDto from './workflowDtos'

export const ApprovalRequestDto = z.object({
  requestId: z.string(),
  workflowId: z.string(),
  entityType: z.string(),
  entityId: z.string(),
  forumId: z.string().nullable().optional(),
  areaId: z.string().nullable().optional(),
  unitId: z.string().nullable().optional(),
  requestedBy: z.string(),
  requestedAt: z.date(),
  status: z.string(),
  currentStageOrder: z.number().nullable().optional(),
  workflow: ApprovalWorkflowDto.nullable().optional(),
})

export type ApprovalRequest = z.infer<typeof ApprovalRequestDto>

export const ApprovalRequestsSearchResponseDto = z.object({
  items: z.array(ApprovalRequestDto),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
})

export type ApprovalRequestsSearchResponse = z.infer<typeof ApprovalRequestsSearchResponseDto>

export default ApprovalRequestDto

export const SubmitRequestResponseDto = z.object({
  requestId: z.string(),
  status: z.string(),
})

export const ProcessApprovalResponseDto = z.object({
  execution: z.object({}).optional(),
  request: z.object({}).optional(),
})

export const PendingApprovalsListDto = z.array(z.object({
  executionId: z.string(),
  requestId: z.string(),
  stageName: z.string().optional(),
  status: z.string().optional(),
  assignedApproverId: z.string().nullable().optional(),
}))

export const ApprovalRequestWithExecutionsDto = z.object({
  request: ApprovalRequestDto.nullable(),
  executions: z.array(z.object({
    executionId: z.string(),
    stageId: z.string(),
    stageOrder: z.number(),
    assignedApproverId: z.string().nullable().optional(),
    status: z.string(),
    decision: z.string().nullable().optional(),
    reviewedBy: z.string().nullable().optional(),
    reviewedAt: z.date().nullable().optional(),
    comments: z.string().nullable().optional(),
  })),
  workflow: ApprovalWorkflowDto.nullable().optional(),  
})

