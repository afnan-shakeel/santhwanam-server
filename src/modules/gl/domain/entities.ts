/**
 * Domain entities for General Ledger Module
 * See docs/domain/6.gl.md
 */

// Enums
export enum AccountType {
  Asset = 'Asset',
  Liability = 'Liability',
  Revenue = 'Revenue',
  Expense = 'Expense',
  Equity = 'Equity',
}

export enum NormalBalance {
  Debit = 'Debit',
  Credit = 'Credit',
}

export enum EntryStatus {
  Draft = 'Draft',
  Posted = 'Posted',
  Reversed = 'Reversed',
}

export enum PeriodStatus {
  Open = 'Open',
  Closed = 'Closed',
}

// Chart of Accounts
export interface ChartOfAccount {
  accountId: string;
  accountCode: string;
  accountName: string;
  accountType: AccountType;
  accountCategory: string | null;
  
  // Hierarchy
  parentAccountId: string | null;
  accountLevel: number;
  
  // Balance tracking
  normalBalance: NormalBalance;
  currentBalance: number;
  
  // Status
  isActive: boolean;
  isSystemAccount: boolean;
  
  // Timestamps
  createdAt: Date;
  createdBy: string;
  updatedAt: Date | null;
  updatedBy: string | null;
}

// Journal Entry
export interface JournalEntry {
  entryId: string;
  entryNumber: string;
  
  // Entry details
  entryDate: Date;
  postingDate: Date | null;
  description: string;
  reference: string | null;
  
  // Source tracking
  sourceModule: string;
  sourceEntityId: string | null;
  sourceTransactionType: string;
  
  // Status
  entryStatus: EntryStatus;
  
  // Reversal tracking
  reversedEntryId: string | null;
  reversalReason: string | null;
  reversedAt: Date | null;
  reversedBy: string | null;
  
  // Validation
  totalDebit: number;
  totalCredit: number;
  isBalanced: boolean;
  
  // Timestamps
  createdAt: Date;
  createdBy: string;
  postedAt: Date | null;
  postedBy: string | null;
  updatedAt: Date | null;
}

// Journal Entry Line
export interface JournalEntryLine {
  lineId: string;
  entryId: string;
  
  lineNumber: number;
  
  // Account reference
  accountId: string;
  accountCode: string;
  accountName: string;
  
  // Amounts
  debitAmount: number;
  creditAmount: number;
  
  description: string;
  
  // Timestamps
  createdAt: Date;
}

// Fiscal Period
export interface FiscalPeriod {
  periodId: string;
  fiscalYear: number;
  periodNumber: number;
  periodName: string;
  
  startDate: Date;
  endDate: Date;
  
  status: PeriodStatus;
  
  closedAt: Date | null;
  closedBy: string | null;
  
  createdAt: Date;
}

// Standard Chart of Accounts Configuration
export const STANDARD_CHART_OF_ACCOUNTS = [
  // ASSETS (1000-1999)
  {
    accountCode: '1000',
    accountName: 'Cash',
    accountType: AccountType.Asset,
    accountCategory: 'Current Assets',
    normalBalance: NormalBalance.Debit,
    isSystemAccount: true,
  },
  {
    accountCode: '1100',
    accountName: 'Bank Account',
    accountType: AccountType.Asset,
    accountCategory: 'Current Assets',
    normalBalance: NormalBalance.Debit,
    isSystemAccount: false,
  },
  
  // LIABILITIES (2000-2999)
  {
    accountCode: '2100',
    accountName: 'Member Wallet Liability',
    accountType: AccountType.Liability,
    accountCategory: 'Current Liabilities',
    normalBalance: NormalBalance.Credit,
    isSystemAccount: true,
  },
  
  // REVENUE (4000-4999)
  {
    accountCode: '4100',
    accountName: 'Registration Fee Revenue',
    accountType: AccountType.Revenue,
    accountCategory: 'Operating Revenue',
    normalBalance: NormalBalance.Credit,
    isSystemAccount: true,
  },
  {
    accountCode: '4200',
    accountName: 'Contribution Income',
    accountType: AccountType.Revenue,
    accountCategory: 'Operating Revenue',
    normalBalance: NormalBalance.Credit,
    isSystemAccount: true,
  },
  {
    accountCode: '4300',
    accountName: 'Donation Income',
    accountType: AccountType.Revenue,
    accountCategory: 'Other Revenue',
    normalBalance: NormalBalance.Credit,
    isSystemAccount: false,
  },
  
  // EXPENSES (5000-5999)
  {
    accountCode: '5100',
    accountName: 'Death Benefit Expense',
    accountType: AccountType.Expense,
    accountCategory: 'Operating Expenses',
    normalBalance: NormalBalance.Debit,
    isSystemAccount: true,
  },
  {
    accountCode: '5200',
    accountName: 'Operating Expenses',
    accountType: AccountType.Expense,
    accountCategory: 'Operating Expenses',
    normalBalance: NormalBalance.Debit,
    isSystemAccount: false,
  },
  {
    accountCode: '5300',
    accountName: 'Charitable Donations',
    accountType: AccountType.Expense,
    accountCategory: 'Other Expenses',
    normalBalance: NormalBalance.Debit,
    isSystemAccount: false,
  },
] as const;
