// Command: Submit Agent Registration
// Submits agent for approval workflow

import { AgentService } from "../agentService";
import { asyncLocalStorage } from "@/shared/infrastructure/context/AsyncLocalStorageManager";
import { BadRequestError } from "@/shared/utils/error-handling/httpErrors";
import { ApprovalRequestService } from "@/modules/approval-workflow/application/approvalRequestService";
import prisma from "@/shared/infrastructure/prisma/prismaClient";

export interface SubmitAgentRegistrationCommand {
  agentId: string;
}

export class SubmitAgentRegistrationHandler {
  constructor(
    private agentService: AgentService,
    private approvalRequestService: ApprovalRequestService
  ) {}

  async execute(cmd: SubmitAgentRegistrationCommand) {
    const actorId = asyncLocalStorage.tryGetUserId();
    if (!actorId) {
      throw new BadRequestError("Unauthenticated");
    }

    // Note: submitRequest creates its own transaction internally
    // Submit registration (validates and sets PendingApproval)
    const agent = await this.agentService.submitRegistration(
      cmd.agentId,
      actorId
    );

    // Create approval request
    const approvalResult = await this.approvalRequestService.submitRequest({
      workflowCode: "agent_registration",
      entityType: "Agent",
      entityId: cmd.agentId,
      forumId: agent.forumId,
      areaId: agent.areaId,
      unitId: agent.unitId,
      requestedBy: actorId,
    });

    // Link approval request to agent
    const agentRepo = new (await import("../../infrastructure/prisma/agentRepository")).PrismaAgentRepository();
    await agentRepo.update(
      cmd.agentId,
      {
        approvalRequestId: approvalResult.request.requestId,
      }
    );

    return {
      agent,
      approvalRequest: approvalResult.request,
    };
  }
}
