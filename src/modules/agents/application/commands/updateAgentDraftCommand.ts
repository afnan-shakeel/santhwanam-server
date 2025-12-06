// Command: Update Agent Draft
// Updates agent while in Draft status

import { AgentService } from "../agentService";
import { Gender } from "../../domain/entities";
import { asyncLocalStorage } from "@/shared/infrastructure/context/AsyncLocalStorageManager";
import { BadRequestError } from "@/shared/utils/error-handling/httpErrors";

export interface UpdateAgentDraftCommand {
  agentId: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  gender?: Gender;
  contactNumber?: string;
  alternateContactNumber?: string;
  email?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export class UpdateAgentDraftHandler {
  constructor(private agentService: AgentService) {}

  async execute(cmd: UpdateAgentDraftCommand) {
    const actorId = asyncLocalStorage.tryGetUserId();
    if (!actorId) {
      throw new BadRequestError("Unauthenticated");
    }

    const { agentId, ...input } = cmd;
    return this.agentService.updateDraft(agentId, {
      ...input,
      updatedBy: actorId,
    });
  }
}
