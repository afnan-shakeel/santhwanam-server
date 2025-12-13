/**
 * Controller for Agents API
 */
export class AgentsController {
    agentService;
    startRegistrationCmd;
    updateDraftCmd;
    submitRegistrationCmd;
    updateAgentCmd;
    terminateAgentCmd;
    constructor(agentService, startRegistrationCmd, updateDraftCmd, submitRegistrationCmd, updateAgentCmd, terminateAgentCmd) {
        this.agentService = agentService;
        this.startRegistrationCmd = startRegistrationCmd;
        this.updateDraftCmd = updateDraftCmd;
        this.submitRegistrationCmd = submitRegistrationCmd;
        this.updateAgentCmd = updateAgentCmd;
        this.terminateAgentCmd = terminateAgentCmd;
    }
    /**
     * POST /api/agents/register
     * Start agent registration (creates in Draft status)
     */
    startRegistration = async (req, res, next) => {
        const agent = await this.startRegistrationCmd.execute(req.body);
        next({ dto: "Agent", data: agent, status: 201 });
    };
    /**
     * PATCH /api/agents/:agentId/draft
     * Update agent while in Draft status
     */
    updateDraft = async (req, res, next) => {
        const { agentId } = req.params;
        const agent = await this.updateDraftCmd.execute({
            agentId,
            ...req.body,
        });
        next({ dto: "Agent", data: agent, status: 200 });
    };
    /**
     * POST /api/agents/:agentId/submit
     * Submit agent registration for approval
     */
    submitRegistration = async (req, res, next) => {
        const { agentId } = req.params;
        const result = await this.submitRegistrationCmd.execute({ agentId });
        next({ dto: "AgentSubmission", data: result, status: 200 });
    };
    /**
     * PATCH /api/agents/:agentId
     * Update approved agent details
     */
    updateAgent = async (req, res, next) => {
        const { agentId } = req.params;
        const agent = await this.updateAgentCmd.execute({
            agentId,
            ...req.body,
        });
        next({ dto: "Agent", data: agent, status: 200 });
    };
    /**
     * POST /api/agents/:agentId/terminate
     * Terminate agent (requires 0 active members)
     */
    terminateAgent = async (req, res, next) => {
        const { agentId } = req.params;
        const agent = await this.terminateAgentCmd.execute({
            agentId,
            ...req.body,
        });
        next({ dto: "Agent", data: agent, status: 200 });
    };
    /**
     * GET /api/agents/:agentId
     * Get agent by ID
     */
    getAgentById = async (req, res, next) => {
        const { agentId } = req.params;
        const agent = await this.agentService.getAgentById(agentId);
        next({ dto: "Agent", data: agent, status: 200 });
    };
    /**
     * GET /api/agents/unit/:unitId
     * List agents by unit
     */
    listByUnit = async (req, res, next) => {
        const { unitId } = req.params;
        const skip = parseInt(req.query.skip) || 0;
        const take = parseInt(req.query.take) || 20;
        const result = await this.agentService.listByUnit(unitId, skip, take);
        next({ dto: "AgentList", data: result, status: 200 });
    };
    /**
     * GET /api/agents/area/:areaId
     * List agents by area
     */
    listByArea = async (req, res, next) => {
        const { areaId } = req.params;
        const skip = parseInt(req.query.skip) || 0;
        const take = parseInt(req.query.take) || 20;
        const result = await this.agentService.listByArea(areaId, skip, take);
        next({ dto: "AgentList", data: result, status: 200 });
    };
    /**
     * GET /api/agents/forum/:forumId
     * List agents by forum
     */
    listByForum = async (req, res, next) => {
        const { forumId } = req.params;
        const skip = parseInt(req.query.skip) || 0;
        const take = parseInt(req.query.take) || 20;
        const result = await this.agentService.listByForum(forumId, skip, take);
        next({ dto: "AgentList", data: result, status: 200 });
    };
    /**
     * POST /api/agents/search
     * Search agents with advanced filtering
     */
    searchAgents = async (req, res, next) => {
        const result = await this.agentService.searchAgents(req.body);
        next({ dto: "SearchResult", data: result, status: 200 });
    };
}
