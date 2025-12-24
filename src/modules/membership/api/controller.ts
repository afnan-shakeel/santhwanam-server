import { Request, Response, NextFunction } from 'express';
import { MembershipTierService } from '../application/membershipTierService';

export class MembershipTierController {
  constructor(private readonly tierService: MembershipTierService) {}

  getAllTiers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const activeOnly = req.query.activeOnly === 'true';
      const tiers = await this.tierService.getAllTiers(activeOnly);

      res.status(200).json({
        success: true,
        data: tiers,
        message: 'Membership tiers retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  getTierById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tierId } = req.params;
      const tier = await this.tierService.getTierById(tierId);

      if (!tier) {
        res.status(404).json({
          success: false,
          message: 'Membership tier not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: tier,
        message: 'Membership tier retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  };
}
