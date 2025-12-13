/**
 * Service for managing approval workflows
 * Handles workflow CRUD operations
 */
import { BadRequestError, NotFoundError } from '@/shared/utils/error-handling/httpErrors';
import prisma from '@/shared/infrastructure/prisma/prismaClient';
export class ApprovalWorkflowService {
    workflowRepo;
    stageRepo;
    constructor(workflowRepo, stageRepo) {
        this.workflowRepo = workflowRepo;
        this.stageRepo = stageRepo;
    }
    /**
     * Create a new approval workflow with stages
     */
    async createWorkflow(data) {
        // Validate workflow code uniqueness
        const existing = await this.workflowRepo.findByCode(data.workflowCode);
        if (existing) {
            throw new BadRequestError(`Workflow with code ${data.workflowCode} already exists`);
        }
        // Validate stages
        if (!data.stages || data.stages.length === 0) {
            throw new BadRequestError('At least one approval stage is required');
        }
        // Validate stage order uniqueness
        const stageOrders = data.stages.map(s => s.stageOrder);
        if (new Set(stageOrders).size !== stageOrders.length) {
            throw new BadRequestError('Stage orders must be unique');
        }
        // Create workflow and stages in transaction
        return await prisma.$transaction(async (tx) => {
            const workflow = await this.workflowRepo.create({
                workflowCode: data.workflowCode,
                workflowName: data.workflowName,
                description: data.description,
                module: data.module,
                entityType: data.entityType,
                isActive: data.isActive,
                requiresAllStages: data.requiresAllStages,
                createdBy: data.createdBy,
            }, tx);
            const stagesData = data.stages.map(stage => ({
                ...stage,
                workflowId: workflow.workflowId,
            }));
            await this.stageRepo.createMany(stagesData, tx);
            const stages = await this.stageRepo.findByWorkflow(workflow.workflowId, tx);
            return { workflow, stages };
        });
    }
    /**
     * Update workflow metadata (not stages)
     */
    async updateWorkflow(workflowId, data) {
        const workflow = await this.workflowRepo.findById(workflowId);
        if (!workflow) {
            throw new NotFoundError('Workflow not found');
        }
        return this.workflowRepo.update(workflowId, data);
    }
    /**
     * Get workflow by ID with stages
     */
    async getWorkflowById(workflowId) {
        const workflow = await this.workflowRepo.findById(workflowId);
        if (!workflow) {
            throw new NotFoundError('Workflow not found');
        }
        const stages = await this.stageRepo.findByWorkflow(workflowId);
        return { workflow, stages };
    }
    /**
     * Get workflow by code with stages
     */
    async getWorkflowByCode(workflowCode) {
        const workflow = await this.workflowRepo.findByCode(workflowCode);
        if (!workflow) {
            throw new NotFoundError('Workflow not found');
        }
        const stages = await this.stageRepo.findByWorkflow(workflow.workflowId);
        return { workflow, stages };
    }
    /**
     * List active workflows
     */
    async listActiveWorkflows(module) {
        return this.workflowRepo.listActive(module);
    }
    /**
     * List all workflows
     */
    async listAllWorkflows() {
        return this.workflowRepo.listAll();
    }
}
