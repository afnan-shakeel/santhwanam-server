/**
 * API controller for GL module
 */
import { searchService } from '@/shared/infrastructure/search';
export class GLController {
    chartOfAccountService;
    journalEntryService;
    fiscalPeriodService;
    reportService;
    constructor(chartOfAccountService, journalEntryService, fiscalPeriodService, reportService) {
        this.chartOfAccountService = chartOfAccountService;
        this.journalEntryService = journalEntryService;
        this.fiscalPeriodService = fiscalPeriodService;
        this.reportService = reportService;
    }
    // ===========================
    // Chart of Accounts
    // ===========================
    createAccount = async (req, res) => {
        const userId = req.user?.userId || 'system';
        const account = await this.chartOfAccountService.createAccount({
            ...req.body,
            createdBy: userId,
        });
        return res.json({ dto: 'ChartOfAccount', data: account, status: 201 });
    };
    updateAccount = async (req, res) => {
        const userId = req.user?.userId || 'system';
        const account = await this.chartOfAccountService.updateAccount(req.params.accountId, {
            ...req.body,
            updatedBy: userId,
        });
        return res.json({ dto: 'ChartOfAccount', data: account, status: 200 });
    };
    deactivateAccount = async (req, res) => {
        const userId = req.user?.userId || 'system';
        const account = await this.chartOfAccountService.deactivateAccount(req.params.accountId, userId);
        return res.json({ dto: 'ChartOfAccount', data: account, status: 200 });
    };
    getAccountById = async (req, res) => {
        const account = await this.chartOfAccountService.getAccountById(req.params.accountId);
        return res.json({ dto: 'ChartOfAccount', data: account, status: 200 });
    };
    getAccountByCode = async (req, res) => {
        const account = await this.chartOfAccountService.getAccountByCode(req.params.accountCode);
        return res.json({ dto: 'ChartOfAccount', data: account, status: 200 });
    };
    getAllAccounts = async (req, res) => {
        const accounts = await this.chartOfAccountService.getAllAccounts();
        return res.json({ dto: 'ChartOfAccountList', data: accounts, status: 200 });
    };
    getAccountsByType = async (req, res) => {
        const accounts = await this.chartOfAccountService.getAccountsByType(req.params.accountType);
        return res.json({ dto: 'ChartOfAccountList', data: accounts, status: 200 });
    };
    getActiveAccounts = async (req, res) => {
        const accounts = await this.chartOfAccountService.getActiveAccounts();
        return res.json({ dto: 'ChartOfAccountList', data: accounts, status: 200 });
    };
    searchAccounts = async (req, res) => {
        const result = await searchService.execute({ ...req.body, model: 'ChartOfAccount' });
        return res.json({ dto: 'SearchResult', data: result, status: 200 });
    };
    // ===========================
    // Journal Entries
    // ===========================
    createJournalEntry = async (req, res) => {
        const userId = req.user?.userId || 'system';
        const { entry, lines } = await this.journalEntryService.createJournalEntry({
            ...req.body,
            entryDate: new Date(req.body.entryDate),
            createdBy: userId,
        });
        return res.json({ dto: 'JournalEntryWithLines', data: { entry, lines }, status: 201 });
    };
    postJournalEntry = async (req, res) => {
        const userId = req.user?.userId || 'system';
        const entry = await this.journalEntryService.postJournalEntry(req.params.entryId, userId);
        return res.json({ dto: 'JournalEntry', data: entry, status: 200 });
    };
    reverseJournalEntry = async (req, res) => {
        const userId = req.user?.userId || 'system';
        const result = await this.journalEntryService.reverseJournalEntry(req.params.entryId, userId, req.body.reason);
        return res.json({ dto: 'JournalEntryReversal', data: result, status: 200 });
    };
    getJournalEntryById = async (req, res) => {
        const result = await this.journalEntryService.getJournalEntryById(req.params.entryId);
        return res.json({ dto: 'JournalEntryWithLines', data: result, status: 200 });
    };
    getJournalEntriesByDateRange = async (req, res) => {
        const entries = await this.journalEntryService.getJournalEntriesByDateRange(new Date(req.query.startDate), new Date(req.query.endDate));
        return res.json({ dto: 'JournalEntryList', data: entries, status: 200 });
    };
    searchJournalEntries = async (req, res) => {
        const result = await searchService.execute({ ...req.body, model: 'JournalEntry' });
        return res.json({ dto: 'SearchResult', data: result, status: 200 });
    };
    // ===========================
    // Fiscal Periods
    // ===========================
    createFiscalPeriod = async (req, res) => {
        const period = await this.fiscalPeriodService.createFiscalPeriod({
            ...req.body,
            startDate: new Date(req.body.startDate),
            endDate: new Date(req.body.endDate),
        });
        return res.json({ dto: 'FiscalPeriod', data: period, status: 201 });
    };
    closeFiscalPeriod = async (req, res) => {
        const userId = req.user?.userId || 'system';
        const period = await this.fiscalPeriodService.closeFiscalPeriod(req.params.periodId, userId);
        return res.json({ dto: 'FiscalPeriod', data: period, status: 200 });
    };
    getFiscalPeriodById = async (req, res) => {
        const period = await this.fiscalPeriodService.getFiscalPeriodById(req.params.periodId);
        return res.json({ dto: 'FiscalPeriod', data: period, status: 200 });
    };
    getAllFiscalPeriods = async (req, res) => {
        const periods = await this.fiscalPeriodService.getAllFiscalPeriods();
        return res.json({ dto: 'FiscalPeriodList', data: periods, status: 200 });
    };
    getFiscalPeriodsByYear = async (req, res) => {
        const periods = await this.fiscalPeriodService.getFiscalPeriodsByYear(parseInt(req.params.fiscalYear));
        return res.json({ dto: 'FiscalPeriodList', data: periods, status: 200 });
    };
    getCurrentFiscalPeriod = async (req, res) => {
        const period = await this.fiscalPeriodService.getCurrentFiscalPeriod();
        return res.json({ dto: 'FiscalPeriod', data: period, status: 200 });
    };
    // ===========================
    // Reports
    // ===========================
    getTrialBalance = async (req, res) => {
        const asOfDate = req.query.asOfDate ? new Date(req.query.asOfDate) : undefined;
        const report = await this.reportService.generateTrialBalance(asOfDate);
        return res.json({ dto: 'TrialBalance', data: report, status: 200 });
    };
    getIncomeStatement = async (req, res) => {
        const report = await this.reportService.generateIncomeStatement(new Date(req.query.startDate), new Date(req.query.endDate));
        return res.json({ dto: 'IncomeStatement', data: report, status: 200 });
    };
    getBalanceSheet = async (req, res) => {
        const asOfDate = req.query.asOfDate ? new Date(req.query.asOfDate) : undefined;
        const report = await this.reportService.generateBalanceSheet(asOfDate);
        return res.json({ dto: 'BalanceSheet', data: report, status: 200 });
    };
}
