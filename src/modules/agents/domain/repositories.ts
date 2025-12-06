// Domain: Agents
// Repository interfaces for Agent aggregate

import { Agent, RegistrationStatus, AgentStatus } from "./entities";

export interface AgentRepository {
  // Create
  create(
    data: Omit<Agent, "agentId" | "createdAt" | "updatedAt">,
    tx?: any
  ): Promise<Agent>;

  // Read
  findById(agentId: string, tx?: any): Promise<Agent | null>;
  findByCode(unitId: string, agentCode: string, tx?: any): Promise<Agent | null>;
  findByEmail(email: string, tx?: any): Promise<Agent | null>;
  findByUserId(userId: string, tx?: any): Promise<Agent | null>;

  // Update
  update(
    agentId: string,
    data: Partial<Omit<Agent, "agentId" | "createdAt" | "createdBy">>,
    tx?: any
  ): Promise<Agent>;

  updateRegistrationStatus(
    agentId: string,
    status: RegistrationStatus,
    approvalRequestId?: string | null,
    updatedBy?: string,
    tx?: any
  ): Promise<Agent>;

  updateAgentStatus(
    agentId: string,
    status: AgentStatus,
    updatedBy: string,
    terminatedDate?: Date | null,
    terminationReason?: string | null,
    tx?: any
  ): Promise<Agent>;

  // List with pagination
  listByUnit(
    unitId: string,
    skip?: number,
    take?: number,
    tx?: any
  ): Promise<{ agents: Agent[]; total: number }>;

  listByArea(
    areaId: string,
    skip?: number,
    take?: number,
    tx?: any
  ): Promise<{ agents: Agent[]; total: number }>;

  listByForum(
    forumId: string,
    skip?: number,
    take?: number,
    tx?: any
  ): Promise<{ agents: Agent[]; total: number }>;

  // Existence checks
  existsByCode(unitId: string, agentCode: string, tx?: any): Promise<boolean>;
  existsByEmail(email: string, tx?: any): Promise<boolean>;

  // Statistics
  countByStatus(
    unitId: string,
    status: AgentStatus,
    tx?: any
  ): Promise<number>;
}
