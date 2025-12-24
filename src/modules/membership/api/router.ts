import { Router } from 'express';
import { MembershipTierController } from './controller';

export function createMembershipRouter(controller: MembershipTierController): Router {
  const router = Router();

  router.get('/tiers', controller.getAllTiers);
  router.get('/tiers/:tierId', controller.getTierById);

  return router;
}
