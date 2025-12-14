import { z } from 'zod'

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
