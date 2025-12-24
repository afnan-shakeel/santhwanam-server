import prisma from '@/shared/infrastructure/prisma/prismaClient';
import { MembershipTier } from '../../domain/entities';
import { MembershipTierRepository } from '../../domain/repositories';

export class PrismaMembershipTierRepository implements MembershipTierRepository {
  async findAll(): Promise<MembershipTier[]> {
    const tiers = await prisma.membershipTier.findMany({
      orderBy: [
        { isDefault: 'desc' },
        { tierName: 'asc' }
      ]
    });

    return tiers.map(this.mapToEntity);
  }

  async findActive(): Promise<MembershipTier[]> {
    const tiers = await prisma.membershipTier.findMany({
      where: { isActive: true },
      orderBy: [
        { isDefault: 'desc' },
        { tierName: 'asc' }
      ]
    });

    return tiers.map(this.mapToEntity);
  }

  async findById(tierId: string): Promise<MembershipTier | null> {
    const tier = await prisma.membershipTier.findUnique({
      where: { tierId }
    });

    return tier ? this.mapToEntity(tier) : null;
  }

  private mapToEntity(tier: any): MembershipTier {
    return {
      tierId: tier.tierId,
      tierCode: tier.tierCode,
      tierName: tier.tierName,
      description: tier.description,
      registrationFee: Number(tier.registrationFee),
      advanceDepositAmount: Number(tier.advanceDepositAmount),
      contributionAmount: Number(tier.contributionAmount),
      deathBenefitAmount: Number(tier.deathBenefitAmount),
      isActive: tier.isActive,
      isDefault: tier.isDefault,
      createdAt: tier.createdAt,
      createdBy: tier.createdBy,
      updatedAt: tier.updatedAt,
      updatedBy: tier.updatedBy
    };
  }
}
