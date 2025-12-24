import { MembershipTierRepository } from '../domain/repositories';
import { MembershipTier } from '../domain/entities';

export class MembershipTierService {
  constructor(private readonly tierRepository: MembershipTierRepository) {}

  async getAllTiers(activeOnly: boolean = false): Promise<MembershipTier[]> {
    if (activeOnly) {
      return this.tierRepository.findActive();
    }
    return this.tierRepository.findAll();
  }

  async getTierById(tierId: string): Promise<MembershipTier | null> {
    return this.tierRepository.findById(tierId);
  }
}
