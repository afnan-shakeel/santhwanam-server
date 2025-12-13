/**
 * Controller for Approval Workflow API
 */
export class ApprovalWorkflowController {
    workflowService;
    requestService;
    createWorkflowCommand;
    submitRequestCommand;
    processApprovalCommand;
    constructor(workflowService, requestService, createWorkflowCommand, submitRequestCommand, processApprovalCommand) {
        this.workflowService = workflowService;
        this.requestService = requestService;
        this.createWorkflowCommand = createWorkflowCommand;
        this.submitRequestCommand = submitRequestCommand;
        this.processApprovalCommand = processApprovalCommand;
    }
    createWorkflow = async (req, res, next) => {
        const dto = req.body;
        const result = await this.createWorkflowCommand.execute(dto);
        next({
            dto: 'CreateWorkflowResponse',
            data: result,
            status: 201,
        });
    };
    updateWorkflow = async (req, res, next) => {
        const { workflowId } = req.params;
        const dto = req.body;
        const workflow = await this.workflowService.updateWorkflow(workflowId, dto);
        next({
            dto: 'ApprovalWorkflow',
            data: workflow,
            status: 200,
        });
    };
    getWorkflowById = async (req, res, next) => {
        const { workflowId } = req.params;
        const result = await this.workflowService.getWorkflowById(workflowId);
        next({
            dto: 'ApprovalWorkflowWithStages',
            data: result,
            status: 200,
        });
    };
    getWorkflowByCode = async (req, res, next) => {
        const { workflowCode } = req.params;
        const result = await this.workflowService.getWorkflowByCode(workflowCode);
        next({
            dto: 'ApprovalWorkflowWithStages',
            data: result,
            status: 200,
        });
    };
    listActiveWorkflows = async (req, res, next) => {
        const { module } = req.query;
        const workflows = await this.workflowService.listActiveWorkflows(module);
        next({
            dto: 'ApprovalWorkflowList',
            data: workflows,
            status: 200,
        });
    };
    listAllWorkflows = async (req, res, next) => {
        const workflows = await this.workflowService.listAllWorkflows();
        next({
            dto: 'ApprovalWorkflowList',
            data: workflows,
            status: 200,
        });
    };
    submitRequest = async (req, res, next) => {
        const dto = req.body;
        const result = await this.submitRequestCommand.execute(dto);
        next({
            dto: 'SubmitRequestResponse',
            data: result,
            status: 201,
        });
    };
    processApproval = async (req, res, next) => {
        const dto = req.body;
        const result = await this.processApprovalCommand.execute(dto);
        next({
            dto: 'ProcessApprovalResponse',
            data: result,
            status: 200,
        });
    };
    getPendingApprovals = async (req, res, next) => {
        const { approverId } = req.params;
        const executions = await this.requestService.getPendingApprovals(approverId);
        next({
            dto: 'PendingApprovalsList',
            data: executions,
            status: 200,
        });
    };
    getRequestById = async (req, res, next) => {
        const { requestId } = req.params;
        const result = await this.requestService.getRequestById(requestId);
        next({
            dto: 'ApprovalRequestWithExecutions',
            data: result,
            status: 200,
        });
    };
    getRequestByEntity = async (req, res, next) => {
        const { entityType, entityId } = req.params;
        const result = await this.requestService.getRequestByEntity(entityType, entityId);
        next({
            dto: 'ApprovalRequestWithExecutions',
            data: result,
            status: 200,
        });
    };
}
