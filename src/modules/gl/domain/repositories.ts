/**
 * Repository interfaces for General Ledger Module
 */

import {
  ChartOfAccount,
  JournalEntry,
  JournalEntryLine,
  FiscalPeriod,
  AccountType,
  EntryStatus,
  PeriodStatus,
} from './entities';

// Chart of Accounts Repository
export interface ChartOfAccountRepository {
  // Basic CRUD
  create(account: Omit<ChartOfAccount, 'accountId' | 'currentBalance' | 'createdAt' | 'updatedAt'>, tx?: any): Promise<ChartOfAccount>;
  update(accountId: string, data: Partial<ChartOfAccount>, tx?: any): Promise<ChartOfAccount>;
  findById(accountId: string, tx?: any): Promise<ChartOfAccount | null>;
  findByCode(accountCode: string, tx?: any): Promise<ChartOfAccount | null>;
  
  // Queries
  findAll(tx?: any): Promise<ChartOfAccount[]>;
  findByType(accountType: AccountType, tx?: any): Promise<ChartOfAccount[]>;
  findActive(tx?: any): Promise<ChartOfAccount[]>;
  findSystemAccounts(tx?: any): Promise<ChartOfAccount[]>;
  findByParent(parentAccountId: string, tx?: any): Promise<ChartOfAccount[]>;
  
  // Balance updates
  updateBalance(accountId: string, amount: number, tx?: any): Promise<void>;
  getBalance(accountId: string, tx?: any): Promise<number>;
  
  // Deactivate
  deactivate(accountId: string, userId: string, tx?: any): Promise<ChartOfAccount>;
}

// Journal Entry Repository
export interface JournalEntryRepository {
  // Basic CRUD
  create(entry: Omit<JournalEntry, 'entryId' | 'entryNumber' | 'isBalanced' | 'createdAt' | 'updatedAt'>, tx?: any): Promise<JournalEntry>;
  update(entryId: string, data: Partial<JournalEntry>, tx?: any): Promise<JournalEntry>;
  findById(entryId: string, tx?: any): Promise<JournalEntry | null>;
  findByNumber(entryNumber: string, tx?: any): Promise<JournalEntry | null>;
  
  // Queries
  findAll(tx?: any): Promise<JournalEntry[]>;
  findByStatus(status: EntryStatus, tx?: any): Promise<JournalEntry[]>;
  findByDateRange(startDate: Date, endDate: Date, tx?: any): Promise<JournalEntry[]>;
  findByAccount(accountId: string, tx?: any): Promise<JournalEntry[]>;
  findBySource(sourceModule: string, sourceEntityId: string, tx?: any): Promise<JournalEntry[]>;
  findUnbalanced(tx?: any): Promise<JournalEntry[]>;
  
  // Status updates
  post(entryId: string, userId: string, tx?: any): Promise<JournalEntry>;
  reverse(entryId: string, userId: string, reason: string, tx?: any): Promise<JournalEntry>;
  
  // Generate next entry number
  generateEntryNumber(tx?: any): Promise<string>;
}

// Journal Entry Line Repository
export interface JournalEntryLineRepository {
  // Basic CRUD
  create(line: Omit<JournalEntryLine, 'lineId' | 'createdAt'>, tx?: any): Promise<JournalEntryLine>;
  createMany(lines: Omit<JournalEntryLine, 'lineId' | 'createdAt'>[], tx?: any): Promise<JournalEntryLine[]>;
  findById(lineId: string, tx?: any): Promise<JournalEntryLine | null>;
  
  // Queries
  findByEntry(entryId: string, tx?: any): Promise<JournalEntryLine[]>;
  findByAccount(accountId: string, tx?: any): Promise<JournalEntryLine[]>;
  findByAccountAndDateRange(accountId: string, startDate: Date, endDate: Date, tx?: any): Promise<JournalEntryLine[]>;
  
  // Calculations
  calculateEntryTotals(entryId: string, tx?: any): Promise<{ totalDebit: number; totalCredit: number }>;
}

// Fiscal Period Repository
export interface FiscalPeriodRepository {
  // Basic CRUD
  create(period: Omit<FiscalPeriod, 'periodId' | 'createdAt'>, tx?: any): Promise<FiscalPeriod>;
  update(periodId: string, data: Partial<FiscalPeriod>, tx?: any): Promise<FiscalPeriod>;
  findById(periodId: string, tx?: any): Promise<FiscalPeriod | null>;
  
  // Queries
  findAll(tx?: any): Promise<FiscalPeriod[]>;
  findByYear(fiscalYear: number, tx?: any): Promise<FiscalPeriod[]>;
  findByStatus(status: PeriodStatus, tx?: any): Promise<FiscalPeriod[]>;
  findCurrent(tx?: any): Promise<FiscalPeriod | null>;
  findByDate(date: Date, tx?: any): Promise<FiscalPeriod | null>;
  
  // Close period
  close(periodId: string, userId: string, tx?: any): Promise<FiscalPeriod>;
}
