// Command: Update Agent
// Updates approved agent details

import { AgentService } from "../agentService";
import { asyncLocalStorage } from "@/shared/infrastructure/context/AsyncLocalStorageManager";
import { BadRequestError } from "@/shared/utils/error-handling/httpErrors";

export interface UpdateAgentCommand {
  agentId: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  contactNumber?: string;
  alternateContactNumber?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export class UpdateAgentHandler {
  constructor(private agentService: AgentService) {}

  async execute(cmd: UpdateAgentCommand) {
    const actorId = asyncLocalStorage.tryGetUserId();
    if (!actorId) {
      throw new BadRequestError("Unauthenticated");
    }

    const { agentId, ...input } = cmd;
    return this.agentService.updateAgent(agentId, {
      ...input,
      updatedBy: actorId,
    });
  }
}
