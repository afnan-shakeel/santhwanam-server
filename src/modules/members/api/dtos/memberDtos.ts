import AgentDto from '@/modules/agents/api/dtos/agentDtos';
import UnitDto from '@/modules/organization-bodies/api/dtos/unitDtos';
import { z } from 'zod';

export const NomineeDto = z.object({
  nomineeId: z.string(),
  memberId: z.string(),
  name: z.string(),
  relation: z.string().nullable().optional(),
});

export const NomineeListDto = z.array(NomineeDto);

export const MemberDocumentDto = z.object({
  documentId: z.string(),
  memberId: z.string(),
  fileName: z.string(),
  fileType: z.string().optional(),
});

export const MemberDocumentListDto = z.array(MemberDocumentDto);

export const MemberDto = z.object({
  memberId: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  status: z.string().optional(),
  createdAt: z.date().optional(),
  agent: AgentDto.nullable().optional(),
  unit: UnitDto.nullable().optional(),
  tier: z
    .object({
      tierId: z.string(),
      tierCode: z.string(),
      tierName: z.string(),
    })
    .nullable()
    .optional(),
  nominees: z.array(NomineeDto).optional(),
  documents: z.array(MemberDocumentDto).optional(),
});

export const MemberListDto = z.object({
  items: z.array(MemberDto),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
});

export const RegistrationPaymentDto = z.object({
  paymentId: z.string(),
  memberId: z.string(),
  amount: z.number(),
  paidAt: z.date().optional(),
});

export const MemberSubmissionDto = z.object({
  submissionId: z.string().optional(),
  memberId: z.string().optional(),
  status: z.string().optional(),
});

export const MemberDetailsDto = z.object({
  member: MemberDto,
  nominees: z.array(NomineeDto).optional(),
  documents: z.array(MemberDocumentDto).optional(),
});

export const SearchResultDto = MemberListDto;

export type Member = z.infer<typeof MemberDto>;
export type MemberList = z.infer<typeof MemberListDto>;

export default MemberDto;
