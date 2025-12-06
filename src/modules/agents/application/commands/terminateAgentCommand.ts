// Command: Terminate Agent
// Terminates agent (only if totalActiveMembers = 0)

import { AgentService } from "../agentService";
import { asyncLocalStorage } from "@/shared/infrastructure/context/AsyncLocalStorageManager";
import { BadRequestError } from "@/shared/utils/error-handling/httpErrors";

export interface TerminateAgentCommand {
  agentId: string;
  terminationReason: string;
}

export class TerminateAgentHandler {
  constructor(private agentService: AgentService) {}

  async execute(cmd: TerminateAgentCommand) {
    const actorId = asyncLocalStorage.tryGetUserId();
    if (!actorId) {
      throw new BadRequestError("Unauthenticated");
    }

    return this.agentService.terminateAgent(
      cmd.agentId,
      cmd.terminationReason,
      actorId
    );
  }
}
