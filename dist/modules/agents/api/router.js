/**
 * Router for Agents API
 */
import { Router } from "express";
import { validateBody } from "@/shared/middleware/validateZod";
import { startAgentRegistrationSchema, updateAgentDraftSchema, updateAgentSchema, terminateAgentSchema, } from "./validators";
import { searchValidationSchema } from "@/shared/validators/searchValidator";
export function createAgentsRouter(controller) {
    const router = Router();
    // Search
    router.post("/search", validateBody(searchValidationSchema), controller.searchAgents);
    // Agent registration workflow
    router.post("/register", validateBody(startAgentRegistrationSchema), controller.startRegistration);
    router.patch("/:agentId/draft", validateBody(updateAgentDraftSchema), controller.updateDraft);
    router.post("/:agentId/submit", controller.submitRegistration);
    // Agent management
    router.get("/:agentId", controller.getAgentById);
    router.patch("/:agentId", validateBody(updateAgentSchema), controller.updateAgent);
    router.post("/:agentId/terminate", validateBody(terminateAgentSchema), controller.terminateAgent);
    // List agents by hierarchy
    router.get("/unit/:unitId", controller.listByUnit);
    router.get("/area/:areaId", controller.listByArea);
    router.get("/forum/:forumId", controller.listByForum);
    return router;
}
