/**
 * API controller for GL module
 */

import { Request, Response } from 'express';
import { ChartOfAccountService } from '../application/chartOfAccountService';
import { JournalEntryService } from '../application/journalEntryService';
import { FiscalPeriodService } from '../application/fiscalPeriodService';
import { GLReportService } from '../application/reportService';
import { searchService } from '@/shared/infrastructure/search';

export class GLController {
  constructor(
    private chartOfAccountService: ChartOfAccountService,
    private journalEntryService: JournalEntryService,
    private fiscalPeriodService: FiscalPeriodService,
    private reportService: GLReportService
  ) {}

  // ===========================
  // Chart of Accounts
  // ===========================

  createAccount = async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId || 'system';
    const account = await this.chartOfAccountService.createAccount({
      ...req.body,
      createdBy: userId,
    });
    return res.json({ dto: 'ChartOfAccount', data: account, status: 201 });
  };

  updateAccount = async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId || 'system';
    const account = await this.chartOfAccountService.updateAccount(req.params.accountId, {
      ...req.body,
      updatedBy: userId,
    });
    return res.json({ dto: 'ChartOfAccount', data: account, status: 200 });
  };

  deactivateAccount = async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId || 'system';
    const account = await this.chartOfAccountService.deactivateAccount(req.params.accountId, userId);
    return res.json({ dto: 'ChartOfAccount', data: account, status: 200 });
  };

  getAccountById = async (req: Request, res: Response) => {
    const account = await this.chartOfAccountService.getAccountById(req.params.accountId);
    return res.json({ dto: 'ChartOfAccount', data: account, status: 200 });
  };

  getAccountByCode = async (req: Request, res: Response) => {
    const account = await this.chartOfAccountService.getAccountByCode(req.params.accountCode);
    return res.json({ dto: 'ChartOfAccount', data: account, status: 200 });
  };

  getAllAccounts = async (req: Request, res: Response) => {
    const accounts = await this.chartOfAccountService.getAllAccounts();
    return res.json({ dto: 'ChartOfAccountList', data: accounts, status: 200 });
  };

  getAccountsByType = async (req: Request, res: Response) => {
    const accounts = await this.chartOfAccountService.getAccountsByType(req.params.accountType as any);
    return res.json({ dto: 'ChartOfAccountList', data: accounts, status: 200 });
  };

  getActiveAccounts = async (req: Request, res: Response) => {
    const accounts = await this.chartOfAccountService.getActiveAccounts();
    return res.json({ dto: 'ChartOfAccountList', data: accounts, status: 200 });
  };

  searchAccounts = async (req: Request, res: Response) => {
    const result = await searchService.execute({ ...req.body, model: 'ChartOfAccount' });
    return res.json({ dto: 'SearchResult', data: result, status: 200 });
  };

  // ===========================
  // Journal Entries
  // ===========================

  createJournalEntry = async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId || 'system';
    const { entry, lines } = await this.journalEntryService.createJournalEntry({
      ...req.body,
      entryDate: new Date(req.body.entryDate),
      createdBy: userId,
    });
    return res.json({ dto: 'JournalEntryWithLines', data: { entry, lines }, status: 201 });
  };

  postJournalEntry = async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId || 'system';
    const entry = await this.journalEntryService.postJournalEntry(req.params.entryId, userId);
    return res.json({ dto: 'JournalEntry', data: entry, status: 200 });
  };

  reverseJournalEntry = async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId || 'system';
    const result = await this.journalEntryService.reverseJournalEntry(
      req.params.entryId,
      userId,
      req.body.reason
    );
    return res.json({ dto: 'JournalEntryReversal', data: result, status: 200 });
  };

  getJournalEntryById = async (req: Request, res: Response) => {
    const result = await this.journalEntryService.getJournalEntryById(req.params.entryId);
    return res.json({ dto: 'JournalEntryWithLines', data: result, status: 200 });
  };

  getJournalEntriesByDateRange = async (req: Request, res: Response) => {
    const entries = await this.journalEntryService.getJournalEntriesByDateRange(
      new Date(req.query.startDate as string),
      new Date(req.query.endDate as string)
    );
    return res.json({ dto: 'JournalEntryList', data: entries, status: 200 });
  };

  searchJournalEntries = async (req: Request, res: Response) => {
    const result = await searchService.execute({ ...req.body, model: 'JournalEntry' });
    return res.json({ dto: 'SearchResult', data: result, status: 200 });
  };

  // ===========================
  // Fiscal Periods
  // ===========================

  createFiscalPeriod = async (req: Request, res: Response) => {
    const period = await this.fiscalPeriodService.createFiscalPeriod({
      ...req.body,
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate),
    });
    return res.json({ dto: 'FiscalPeriod', data: period, status: 201 });
  };

  closeFiscalPeriod = async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId || 'system';
    const period = await this.fiscalPeriodService.closeFiscalPeriod(req.params.periodId, userId);
    return res.json({ dto: 'FiscalPeriod', data: period, status: 200 });
  };

  getFiscalPeriodById = async (req: Request, res: Response) => {
    const period = await this.fiscalPeriodService.getFiscalPeriodById(req.params.periodId);
    return res.json({ dto: 'FiscalPeriod', data: period, status: 200 });
  };

  getAllFiscalPeriods = async (req: Request, res: Response) => {
    const periods = await this.fiscalPeriodService.getAllFiscalPeriods();
    return res.json({ dto: 'FiscalPeriodList', data: periods, status: 200 });
  };

  getFiscalPeriodsByYear = async (req: Request, res: Response) => {
    const periods = await this.fiscalPeriodService.getFiscalPeriodsByYear(
      parseInt(req.params.fiscalYear)
    );
    return res.json({ dto: 'FiscalPeriodList', data: periods, status: 200 });
  };

  getCurrentFiscalPeriod = async (req: Request, res: Response) => {
    const period = await this.fiscalPeriodService.getCurrentFiscalPeriod();
    return res.json({ dto: 'FiscalPeriod', data: period, status: 200 });
  };

  // ===========================
  // Reports
  // ===========================

  getTrialBalance = async (req: Request, res: Response) => {
    const asOfDate = req.query.asOfDate ? new Date(req.query.asOfDate as string) : undefined;
    const report = await this.reportService.generateTrialBalance(asOfDate);
    return res.json({ dto: 'TrialBalance', data: report, status: 200 });
  };

  getIncomeStatement = async (req: Request, res: Response) => {
    const report = await this.reportService.generateIncomeStatement(
      new Date(req.query.startDate as string),
      new Date(req.query.endDate as string)
    );
    return res.json({ dto: 'IncomeStatement', data: report, status: 200 });
  };

  getBalanceSheet = async (req: Request, res: Response) => {
    const asOfDate = req.query.asOfDate ? new Date(req.query.asOfDate as string) : undefined;
    const report = await this.reportService.generateBalanceSheet(asOfDate);
    return res.json({ dto: 'BalanceSheet', data: report, status: 200 });
  };
}
