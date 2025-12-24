import { Router } from 'express';
import { PrismaMembershipTierRepository } from './infrastructure/prisma/membershipTierRepository';
import { MembershipTierService } from './application/membershipTierService';
import { MembershipTierController } from './api/controller';
import { createMembershipRouter } from './api/router';

// Initialize repository
const tierRepository = new PrismaMembershipTierRepository();

// Initialize service
const tierService = new MembershipTierService(tierRepository);

// Initialize controller
const tierController = new MembershipTierController(tierService);

// Create router
export const membershipRouter: Router = createMembershipRouter(tierController);
