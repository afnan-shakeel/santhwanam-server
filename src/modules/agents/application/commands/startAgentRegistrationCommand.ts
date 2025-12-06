// Command: Start Agent Registration
// Creates agent in Draft status

import { AgentService } from "../agentService";
import { Gender } from "../../domain/entities";
import { asyncLocalStorage } from "@/shared/infrastructure/context/AsyncLocalStorageManager";
import { BadRequestError } from "@/shared/utils/error-handling/httpErrors";

export interface StartAgentRegistrationCommand {
  unitId: string;
  areaId: string;
  forumId: string;
  agentCode: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: Date;
  gender: Gender;
  contactNumber: string;
  alternateContactNumber?: string;
  email: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  joinedDate: Date;
}

export class StartAgentRegistrationHandler {
  constructor(private agentService: AgentService) {}

  async execute(cmd: StartAgentRegistrationCommand) {
    const actorId = asyncLocalStorage.tryGetUserId();
    if (!actorId) {
      throw new BadRequestError("Unauthenticated");
    }

    return this.agentService.startRegistration({
      ...cmd,
      createdBy: actorId,
    });
  }
}
