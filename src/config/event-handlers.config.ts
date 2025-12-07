import { eventBus } from '@/shared/domain/events/event-bus';
import { logger } from '@/shared/utils/logger';

// Agent module
import { agentService, agentRepo } from '@/modules/agents';
import { ActivateAgentOnApprovalHandler, RejectAgentOnApprovalHandler } from '@/modules/agents/application/event-handlers';

// IAM module  
import { PrismaUserRepository } from '@/modules/iam/infrastructure/prisma/userRepository';
import { PrismaRoleRepository } from '@/modules/iam/infrastructure/prisma/roleRepository';
import { PrismaUserRoleRepository } from '@/modules/iam/infrastructure/prisma/userRoleRepository';

/**
 * Register all event handlers for the application
 * This is where you subscribe handlers to specific events
 */
export function registerEventHandlers(): void {
  logger.info('Registering event handlers...');

  // Initialize IAM repositories for agent activation
  const userRepo = new PrismaUserRepository();
  const roleRepo = new PrismaRoleRepository();
  const userRoleRepo = new PrismaUserRoleRepository();

  // Agent approval handlers
  const activateAgentHandler = new ActivateAgentOnApprovalHandler(
    agentRepo,
    userRepo,
    roleRepo,
    userRoleRepo
  );

  const rejectAgentHandler = new RejectAgentOnApprovalHandler(agentService);

  // Subscribe to approval workflow events
  eventBus.subscribe(
    'approval.request.approved',
    activateAgentHandler
  );

  eventBus.subscribe(
    'approval.request.rejected',
    rejectAgentHandler
  );

  logger.info('Event handlers registered successfully');
}
