import { z } from 'zod'

export const ChartOfAccountDto = z.object({
  accountId: z.string(),
  accountCode: z.string(),
  accountName: z.string(),
  accountType: z.string().optional(),
  isActive: z.boolean().optional(),
})

export const ChartOfAccountListDto = z.array(ChartOfAccountDto)

export const ChartOfAccountSearchResponseDto = z.object({
  items: z.array(ChartOfAccountDto),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
})

export const JournalEntryDto = z.object({
  entryId: z.string(),
  entryDate: z.string().optional(),
  description: z.string().optional(),
})

export const JournalEntryLineDto = z.object({
  lineId: z.string(),
  accountCode: z.string().optional(),
  amount: z.number().optional(),
  side: z.string().optional(),
})

export const JournalEntryWithLinesDto = z.object({
  entry: JournalEntryDto,
  lines: z.array(JournalEntryLineDto),
})

export const JournalEntryListDto = z.array(JournalEntryDto)

export const JournalEntrySearchResponseDto = z.object({
  items: z.array(JournalEntryDto),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
})

export const FiscalPeriodDto = z.object({
  periodId: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  isClosed: z.boolean().optional(),
})

export const FiscalPeriodListDto = z.array(FiscalPeriodDto)

export default ChartOfAccountDto
