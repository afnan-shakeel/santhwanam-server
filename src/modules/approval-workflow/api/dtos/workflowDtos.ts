import { z } from 'zod'

export const ApprovalWorkflowDto = z.object({
  workflowId: z.string(),
  workflowCode: z.string(),
  workflowName: z.string(),
  description: z.string().nullable().optional(),
  module: z.string(),
  entityType: z.string(),
  isActive: z.boolean(),
  requiresAllStages: z.boolean(),
  createdAt: z.date(),
  createdBy: z.string().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  updatedBy: z.string().nullable().optional(),
})

export type ApprovalWorkflow = z.infer<typeof ApprovalWorkflowDto>

export const ApprovalWorkflowsSearchResponseDto = z.object({
  items: z.array(ApprovalWorkflowDto),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
})

export type ApprovalWorkflowsSearchResponse = z.infer<typeof ApprovalWorkflowsSearchResponseDto>

export default ApprovalWorkflowDto
