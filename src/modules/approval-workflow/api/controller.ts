/**
 * Controller for Approval Workflow API
 */

import type { Request, Response, NextFunction } from 'express';
import type { ApprovalWorkflowService } from '../application/approvalWorkflowService';
import type { ApprovalRequestService } from '../application/approvalRequestService';
import type { CreateWorkflowCommand } from '../application/commands/createWorkflowCommand';
import type { SubmitRequestCommand } from '../application/commands/submitRequestCommand';
import type { ProcessApprovalCommand } from '../application/commands/processApprovalCommand';
import type {
  CreateWorkflowDTO,
  UpdateWorkflowDTO,
  SubmitRequestDTO,
  ProcessApprovalDTO,
} from './validators';

export class ApprovalWorkflowController {
  constructor(
    private readonly workflowService: ApprovalWorkflowService,
    private readonly requestService: ApprovalRequestService,
    private readonly createWorkflowCommand: CreateWorkflowCommand,
    private readonly submitRequestCommand: SubmitRequestCommand,
    private readonly processApprovalCommand: ProcessApprovalCommand
  ) {}

  createWorkflow = async (req: Request, res: Response, next: NextFunction) => {
    const dto = req.body as CreateWorkflowDTO;
    const result = await this.createWorkflowCommand.execute(dto);
    next({
      dto: 'CreateWorkflowResponse',
      data: result,
      status: 201,
    });
  };

  updateWorkflow = async (req: Request, res: Response, next: NextFunction) => {
    const { workflowId } = req.params;
    const dto = req.body as UpdateWorkflowDTO;
    const workflow = await this.workflowService.updateWorkflow(workflowId, dto);
    next({
      dto: 'ApprovalWorkflow',
      data: workflow,
      status: 200,
    });
  };

  getWorkflowById = async (req: Request, res: Response, next: NextFunction) => {
    const { workflowId } = req.params;
    const result = await this.workflowService.getWorkflowById(workflowId);
    next({
      dto: 'ApprovalWorkflowWithStages',
      data: result,
      status: 200,
    });
  };

  getWorkflowByCode = async (req: Request, res: Response, next: NextFunction) => {
    const { workflowCode } = req.params;
    const result = await this.workflowService.getWorkflowByCode(workflowCode);
    next({
      dto: 'ApprovalWorkflowWithStages',
      data: result,
      status: 200,
    });
  };

  listActiveWorkflows = async (req: Request, res: Response, next: NextFunction) => {
    const { module } = req.query;
    const workflows = await this.workflowService.listActiveWorkflows(
      module as any
    );
    next({
      dto: 'ApprovalWorkflowList',
      data: workflows,
      status: 200,
    });
  };

  listAllWorkflows = async (req: Request, res: Response, next: NextFunction) => {
    const workflows = await this.workflowService.listAllWorkflows();
    next({
      dto: 'ApprovalWorkflowList',
      data: workflows,
      status: 200,
    });
  };

  submitRequest = async (req: Request, res: Response, next: NextFunction) => {
    const dto = req.body as SubmitRequestDTO;
    const result = await this.submitRequestCommand.execute(dto);
    next({
      dto: 'SubmitRequestResponse',
      data: result,
      status: 201,
    });
  };

  processApproval = async (req: Request, res: Response, next: NextFunction) => {
    const dto = req.body as ProcessApprovalDTO;
    const result = await this.processApprovalCommand.execute(dto);
    next({
      dto: 'ProcessApprovalResponse',
      data: result,
      status: 200,
    });
  };

  getPendingApprovals = async (req: Request, res: Response, next: NextFunction) => {
    const { approverId } = req.params;
    const executions = await this.requestService.getPendingApprovals(approverId);
    next({
      dto: 'PendingApprovalsList',
      data: executions,
      status: 200,
    });
  };

  getRequestById = async (req: Request, res: Response, next: NextFunction) => {
    const { requestId } = req.params;
    const result = await this.requestService.getRequestById(requestId);
    next({
      dto: 'ApprovalRequestWithExecutions',
      data: result,
      status: 200,
    });
  };

  getRequestByEntity = async (req: Request, res: Response, next: NextFunction) => {
    const { entityType, entityId } = req.params;
    const result = await this.requestService.getRequestByEntity(entityType, entityId);
    next({
      dto: 'ApprovalRequestWithExecutions',
      data: result,
      status: 200,
    });
  };
}
