/**
 * Prisma implementation of FiscalPeriodRepository
 */

import prisma from '@/shared/infrastructure/prisma/prismaClient';
import { FiscalPeriodRepository } from '../../domain/repositories';
import { FiscalPeriod, PeriodStatus } from '../../domain/entities';

export class PrismaFiscalPeriodRepository implements FiscalPeriodRepository {
  async create(period: Omit<FiscalPeriod, 'periodId' | 'createdAt'>, tx?: any): Promise<FiscalPeriod> {
    const db = tx || prisma;
    const created = await db.fiscalPeriod.create({
      data: {
        fiscalYear: period.fiscalYear,
        periodNumber: period.periodNumber,
        periodName: period.periodName,
        startDate: period.startDate,
        endDate: period.endDate,
        status: period.status,
        closedAt: period.closedAt,
        closedBy: period.closedBy,
      },
    });

    return this.mapToDomain(created);
  }

  async update(periodId: string, data: Partial<FiscalPeriod>, tx?: any): Promise<FiscalPeriod> {
    const db = tx || prisma;
    const updated = await db.fiscalPeriod.update({
      where: { periodId },
      data: {
        periodName: data.periodName,
        status: data.status,
        closedAt: data.closedAt,
        closedBy: data.closedBy,
      },
    });

    return this.mapToDomain(updated);
  }

  async findById(periodId: string, tx?: any): Promise<FiscalPeriod | null> {
    const db = tx || prisma;
    const period = await db.fiscalPeriod.findUnique({
      where: { periodId },
    });

    return period ? this.mapToDomain(period) : null;
  }

  async findAll(tx?: any): Promise<FiscalPeriod[]> {
    const db = tx || prisma;
    const periods = await db.fiscalPeriod.findMany({
      orderBy: [{ fiscalYear: 'desc' }, { periodNumber: 'desc' }],
    });

    return periods.map((period: any) => this.mapToDomain(period));
  }

  async findByYear(fiscalYear: number, tx?: any): Promise<FiscalPeriod[]> {
    const db = tx || prisma;
    const periods = await db.fiscalPeriod.findMany({
      where: { fiscalYear },
      orderBy: { periodNumber: 'asc' },
    });

    return periods.map((period: any) => this.mapToDomain(period));
  }

  async findByStatus(status: PeriodStatus, tx?: any): Promise<FiscalPeriod[]> {
    const db = tx || prisma;
    const periods = await db.fiscalPeriod.findMany({
      where: { status },
      orderBy: [{ fiscalYear: 'desc' }, { periodNumber: 'desc' }],
    });

    return periods.map((period: any) => this.mapToDomain(period));
  }

  async findCurrent(tx?: any): Promise<FiscalPeriod | null> {
    const db = tx || prisma;
    const now = new Date();

    const period = await db.fiscalPeriod.findFirst({
      where: {
        startDate: { lte: now },
        endDate: { gte: now },
        status: PeriodStatus.Open,
      },
    });

    return period ? this.mapToDomain(period) : null;
  }

  async findByDate(date: Date, tx?: any): Promise<FiscalPeriod | null> {
    const db = tx || prisma;
    const period = await db.fiscalPeriod.findFirst({
      where: {
        startDate: { lte: date },
        endDate: { gte: date },
      },
    });

    return period ? this.mapToDomain(period) : null;
  }

  async close(periodId: string, userId: string, tx?: any): Promise<FiscalPeriod> {
    const db = tx || prisma;
    const updated = await db.fiscalPeriod.update({
      where: { periodId },
      data: {
        status: PeriodStatus.Closed,
        closedAt: new Date(),
        closedBy: userId,
      },
    });

    return this.mapToDomain(updated);
  }

  private mapToDomain(prismaPeriod: any): FiscalPeriod {
    return {
      periodId: prismaPeriod.periodId,
      fiscalYear: prismaPeriod.fiscalYear,
      periodNumber: prismaPeriod.periodNumber,
      periodName: prismaPeriod.periodName,
      startDate: prismaPeriod.startDate,
      endDate: prismaPeriod.endDate,
      status: prismaPeriod.status as PeriodStatus,
      closedAt: prismaPeriod.closedAt,
      closedBy: prismaPeriod.closedBy,
      createdAt: prismaPeriod.createdAt,
    };
  }
}
