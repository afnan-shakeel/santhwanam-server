import { z } from 'zod'

export const AgentDto = z.object({
  agentId: z.string(),
  agentCode: z.string(),
  registrationStatus: z.string(),
  unitId: z.string(),
  areaId: z.string(),
  forumId: z.string(),
  userId: z.string().nullable().optional(),
  firstName: z.string().nullable().optional(),
  middleName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  dateOfBirth: z.date().nullable().optional(),
  gender: z.string().nullable().optional(),
  contactNumber: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  agentStatus: z.string().nullable().optional(),
  createdAt: z.date(),
  createdBy: z.string(),
  updatedAt: z.date().nullable().optional(),
  updatedBy: z.string().nullable().optional(),
})

export type Agent = z.infer<typeof AgentDto>

export const AgentListDto = z.array(AgentDto)
export type AgentList = z.infer<typeof AgentListDto>

export const AgentSubmissionDto = z.object({
  agent: AgentDto,
  approvalRequest: z.object({
    requestId: z.string(),
    status: z.string().optional(),
    requestedBy: z.string().optional(),
    requestedAt: z.date().optional(),
  }),
})

export type AgentSubmission = z.infer<typeof AgentSubmissionDto>

export default AgentDto

export const AgentsSearchResponseDto = z.object({
  items: z.array(AgentDto),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
})

export type AgentsSearchResponse = z.infer<typeof AgentsSearchResponseDto>
