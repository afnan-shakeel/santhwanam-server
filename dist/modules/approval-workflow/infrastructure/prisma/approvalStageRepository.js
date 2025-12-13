/**
 * Prisma implementation of ApprovalStageRepository
 */
import prisma from '@/shared/infrastructure/prisma/prismaClient';
export class PrismaApprovalStageRepository {
    async create(data, tx) {
        const client = tx ?? prisma;
        return client.approvalStage.create({
            data: {
                workflowId: data.workflowId,
                stageName: data.stageName,
                stageOrder: data.stageOrder,
                approverType: data.approverType,
                roleId: data.roleId,
                userId: data.userId,
                hierarchyLevel: data.hierarchyLevel,
                isOptional: data.isOptional ?? false,
                autoApprove: data.autoApprove ?? false,
            },
        });
    }
    async createMany(stages, tx) {
        const client = tx ?? prisma;
        await client.approvalStage.createMany({
            data: stages.map(stage => ({
                workflowId: stage.workflowId,
                stageName: stage.stageName,
                stageOrder: stage.stageOrder,
                approverType: stage.approverType,
                roleId: stage.roleId,
                userId: stage.userId,
                hierarchyLevel: stage.hierarchyLevel,
                isOptional: stage.isOptional ?? false,
                autoApprove: stage.autoApprove ?? false,
            })),
        });
    }
    async findByWorkflow(workflowId, tx) {
        const client = tx ?? prisma;
        return client.approvalStage.findMany({
            where: { workflowId },
            orderBy: { stageOrder: 'asc' },
        });
    }
    async findById(stageId, tx) {
        const client = tx ?? prisma;
        return client.approvalStage.findUnique({
            where: { stageId },
        });
    }
    async deleteByWorkflow(workflowId, tx) {
        const client = tx ?? prisma;
        await client.approvalStage.deleteMany({
            where: { workflowId },
        });
    }
}
