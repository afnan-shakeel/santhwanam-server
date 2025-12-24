import { MembershipTier } from './entities';

export interface MembershipTierRepository {
  findAll(): Promise<MembershipTier[]>;
  findActive(): Promise<MembershipTier[]>;
  findById(tierId: string): Promise<MembershipTier | null>;
}
