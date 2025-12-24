export interface MembershipTier {
  tierId: string;
  tierCode: string;
  tierName: string;
  description: string | null;
  registrationFee: number;
  advanceDepositAmount: number;
  contributionAmount: number;
  deathBenefitAmount: number;
  isActive: boolean;
  isDefault: boolean;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date | null;
  updatedBy: string | null;
}
