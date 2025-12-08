/**
 * Application service for GL reports
 */

import {
  ChartOfAccountRepository,
  JournalEntryLineRepository,
} from '../domain/repositories';
import { AccountType } from '../domain/entities';

export interface TrialBalanceItem {
  accountCode: string;
  accountName: string;
  accountType: AccountType;
  debitBalance: number;
  creditBalance: number;
}

export interface IncomeStatementItem {
  accountCode: string;
  accountName: string;
  amount: number;
}

export interface BalanceSheetItem {
  accountCode: string;
  accountName: string;
  amount: number;
}

export class GLReportService {
  constructor(
    private chartOfAccountRepo: ChartOfAccountRepository,
    private journalEntryLineRepo: JournalEntryLineRepository
  ) {}

  /**
   * Generate trial balance
   */
  async generateTrialBalance(asOfDate?: Date): Promise<{
    items: TrialBalanceItem[];
    totalDebit: number;
    totalCredit: number;
  }> {
    const accounts = await this.chartOfAccountRepo.findActive();
    const items: TrialBalanceItem[] = [];
    let totalDebit = 0;
    let totalCredit = 0;

    for (const account of accounts) {
      const balance = account.currentBalance;

      let debitBalance = 0;
      let creditBalance = 0;

      if (account.normalBalance === 'Debit') {
        debitBalance = balance >= 0 ? balance : 0;
        creditBalance = balance < 0 ? Math.abs(balance) : 0;
      } else {
        creditBalance = balance >= 0 ? balance : 0;
        debitBalance = balance < 0 ? Math.abs(balance) : 0;
      }

      if (debitBalance !== 0 || creditBalance !== 0) {
        items.push({
          accountCode: account.accountCode,
          accountName: account.accountName,
          accountType: account.accountType,
          debitBalance,
          creditBalance,
        });

        totalDebit += debitBalance;
        totalCredit += creditBalance;
      }
    }

    return { items, totalDebit, totalCredit };
  }

  /**
   * Generate income statement
   */
  async generateIncomeStatement(startDate: Date, endDate: Date): Promise<{
    revenue: IncomeStatementItem[];
    expenses: IncomeStatementItem[];
    totalRevenue: number;
    totalExpenses: number;
    netIncome: number;
  }> {
    const revenueAccounts = await this.chartOfAccountRepo.findByType(AccountType.Revenue);
    const expenseAccounts = await this.chartOfAccountRepo.findByType(AccountType.Expense);

    const revenue: IncomeStatementItem[] = [];
    const expenses: IncomeStatementItem[] = [];
    let totalRevenue = 0;
    let totalExpenses = 0;

    for (const account of revenueAccounts) {
      const amount = account.currentBalance;
      if (amount !== 0) {
        revenue.push({
          accountCode: account.accountCode,
          accountName: account.accountName,
          amount,
        });
        totalRevenue += amount;
      }
    }

    for (const account of expenseAccounts) {
      const amount = account.currentBalance;
      if (amount !== 0) {
        expenses.push({
          accountCode: account.accountCode,
          accountName: account.accountName,
          amount,
        });
        totalExpenses += amount;
      }
    }

    const netIncome = totalRevenue - totalExpenses;

    return { revenue, expenses, totalRevenue, totalExpenses, netIncome };
  }

  /**
   * Generate balance sheet
   */
  async generateBalanceSheet(asOfDate?: Date): Promise<{
    assets: BalanceSheetItem[];
    liabilities: BalanceSheetItem[];
    equity: BalanceSheetItem[];
    totalAssets: number;
    totalLiabilities: number;
    totalEquity: number;
  }> {
    const assetAccounts = await this.chartOfAccountRepo.findByType(AccountType.Asset);
    const liabilityAccounts = await this.chartOfAccountRepo.findByType(AccountType.Liability);
    const equityAccounts = await this.chartOfAccountRepo.findByType(AccountType.Equity);

    const assets: BalanceSheetItem[] = [];
    const liabilities: BalanceSheetItem[] = [];
    const equity: BalanceSheetItem[] = [];
    let totalAssets = 0;
    let totalLiabilities = 0;
    let totalEquity = 0;

    for (const account of assetAccounts) {
      const amount = account.currentBalance;
      if (amount !== 0) {
        assets.push({
          accountCode: account.accountCode,
          accountName: account.accountName,
          amount,
        });
        totalAssets += amount;
      }
    }

    for (const account of liabilityAccounts) {
      const amount = account.currentBalance;
      if (amount !== 0) {
        liabilities.push({
          accountCode: account.accountCode,
          accountName: account.accountName,
          amount,
        });
        totalLiabilities += amount;
      }
    }

    for (const account of equityAccounts) {
      const amount = account.currentBalance;
      if (amount !== 0) {
        equity.push({
          accountCode: account.accountCode,
          accountName: account.accountName,
          amount,
        });
        totalEquity += amount;
      }
    }

    return { assets, liabilities, equity, totalAssets, totalLiabilities, totalEquity };
  }
}
