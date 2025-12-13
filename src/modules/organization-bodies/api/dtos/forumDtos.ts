import { z } from 'zod'

export const ForumDto = z.object({
  forumId: z.string(),
  forumCode: z.string(),
  forumName: z.string(),
  adminUserId: z.string(),
  establishedDate: z.date(),
  createdAt: z.date(),
  createdBy: z.string(),
  updatedAt: z.date().nullable().optional(),
  updatedBy: z.string().nullable().optional(),
})

export type Forum = z.infer<typeof ForumDto>

export const ForumListDto = z.array(ForumDto)

export type ForumList = z.infer<typeof ForumListDto>

export const ForumsSearchResponseDto = z.object({
  items: z.array(ForumDto),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
})

export type ForumsSearchResponse = z.infer<typeof ForumsSearchResponseDto>

export default ForumDto
