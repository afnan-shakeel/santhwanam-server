/**
 * Application service for Fiscal Period management
 */

import { FiscalPeriodRepository } from '../domain/repositories';
import { FiscalPeriod, PeriodStatus } from '../domain/entities';
import { AppError } from '@/shared/utils/error-handling/AppError';

export class FiscalPeriodService {
  constructor(private fiscalPeriodRepo: FiscalPeriodRepository) {}

  /**
   * Create a new fiscal period
   */
  async createFiscalPeriod(data: {
    fiscalYear: number;
    periodNumber: number;
    periodName: string;
    startDate: Date;
    endDate: Date;
  }): Promise<FiscalPeriod> {
    // Validate dates
    if (data.startDate >= data.endDate) {
      throw new AppError('Start date must be before end date', 400);
    }

    // Check for overlapping periods
    const existingInYear = await this.fiscalPeriodRepo.findByYear(data.fiscalYear);
    for (const period of existingInYear) {
      if (period.periodNumber === data.periodNumber) {
        throw new AppError(`Period ${data.periodNumber} already exists for year ${data.fiscalYear}`, 400);
      }
    }

    return await this.fiscalPeriodRepo.create({
      fiscalYear: data.fiscalYear,
      periodNumber: data.periodNumber,
      periodName: data.periodName,
      startDate: data.startDate,
      endDate: data.endDate,
      status: PeriodStatus.Open,
      closedAt: null,
      closedBy: null,
    });
  }

  /**
   * Close a fiscal period
   */
  async closeFiscalPeriod(periodId: string, userId: string): Promise<FiscalPeriod> {
    const period = await this.fiscalPeriodRepo.findById(periodId);
    if (!period) {
      throw new AppError('Fiscal period not found', 404);
    }

    if (period.status === PeriodStatus.Closed) {
      throw new AppError('Period is already closed', 400);
    }

    return await this.fiscalPeriodRepo.close(periodId, userId);
  }

  /**
   * Get fiscal period by ID
   */
  async getFiscalPeriodById(periodId: string): Promise<FiscalPeriod> {
    const period = await this.fiscalPeriodRepo.findById(periodId);
    if (!period) {
      throw new AppError('Fiscal period not found', 404);
    }
    return period;
  }

  /**
   * Get all fiscal periods
   */
  async getAllFiscalPeriods(): Promise<FiscalPeriod[]> {
    return await this.fiscalPeriodRepo.findAll();
  }

  /**
   * Get fiscal periods by year
   */
  async getFiscalPeriodsByYear(fiscalYear: number): Promise<FiscalPeriod[]> {
    return await this.fiscalPeriodRepo.findByYear(fiscalYear);
  }

  /**
   * Get current fiscal period
   */
  async getCurrentFiscalPeriod(): Promise<FiscalPeriod> {
    const period = await this.fiscalPeriodRepo.findCurrent();
    if (!period) {
      throw new AppError('No current fiscal period found', 404);
    }
    return period;
  }

  /**
   * Get fiscal period by date
   */
  async getFiscalPeriodByDate(date: Date): Promise<FiscalPeriod> {
    const period = await this.fiscalPeriodRepo.findByDate(date);
    if (!period) {
      throw new AppError('No fiscal period found for the given date', 404);
    }
    return period;
  }

  /**
   * Seed initial fiscal periods for a year
   */
  async seedFiscalYear(fiscalYear: number): Promise<FiscalPeriod[]> {
    const periods: FiscalPeriod[] = [];
    
    // Create 12 monthly periods
    for (let month = 0; month < 12; month++) {
      const startDate = new Date(fiscalYear, month, 1);
      const endDate = new Date(fiscalYear, month + 1, 0); // Last day of month

      const period = await this.createFiscalPeriod({
        fiscalYear,
        periodNumber: month + 1,
        periodName: startDate.toLocaleString('default', { month: 'long' }),
        startDate,
        endDate,
      });

      periods.push(period);
    }

    return periods;
  }
}
