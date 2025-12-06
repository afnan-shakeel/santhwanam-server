/**
 * Controller for Organization Bodies API
 */

import type { Request, Response, NextFunction } from 'express';
import type { ForumService } from '../application/forumService';
import type { AreaService } from '../application/areaService';
import type { UnitService } from '../application/unitService';
import type {
  CreateForumCommand,
  UpdateForumCommand,
  AssignForumAdminCommand,
  CreateAreaCommand,
  UpdateAreaCommand,
  AssignAreaAdminCommand,
  CreateUnitCommand,
  UpdateUnitCommand,
  AssignUnitAdminCommand,
} from '../application/commands';

export class OrganizationBodiesController {
  constructor(
    private readonly forumService: ForumService,
    private readonly areaService: AreaService,
    private readonly unitService: UnitService,
    private readonly createForumCmd: CreateForumCommand,
    private readonly updateForumCmd: UpdateForumCommand,
    private readonly assignForumAdminCmd: AssignForumAdminCommand,
    private readonly createAreaCmd: CreateAreaCommand,
    private readonly updateAreaCmd: UpdateAreaCommand,
    private readonly assignAreaAdminCmd: AssignAreaAdminCommand,
    private readonly createUnitCmd: CreateUnitCommand,
    private readonly updateUnitCmd: UpdateUnitCommand,
    private readonly assignUnitAdminCmd: AssignUnitAdminCommand
  ) {}

  // Forum endpoints
  createForum = async (req: Request, res: Response, next: NextFunction) => {
    const forum = await this.createForumCmd.execute(req.body);
    next({ dto: 'Forum', data: forum, status: 201 });
  };

  updateForum = async (req: Request, res: Response, next: NextFunction) => {
    const { forumId } = req.params;
    const forum = await this.updateForumCmd.execute(forumId, req.body);
    next({ dto: 'Forum', data: forum, status: 200 });
  };

  assignForumAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const { forumId } = req.params;
    const forum = await this.assignForumAdminCmd.execute(forumId, req.body);
    next({ dto: 'Forum', data: forum, status: 200 });
  };

  getForumById = async (req: Request, res: Response, next: NextFunction) => {
    const { forumId } = req.params;
    const forum = await this.forumService.getForumById(forumId);
    next({ dto: 'Forum', data: forum, status: 200 });
  };

  getForumByCode = async (req: Request, res: Response, next: NextFunction) => {
    const { forumCode } = req.params;
    const forum = await this.forumService.getForumByCode(forumCode);
    next({ dto: 'Forum', data: forum, status: 200 });
  };

  listForums = async (req: Request, res: Response, next: NextFunction) => {
    const forums = await this.forumService.listForums();
    next({ dto: 'ForumList', data: forums, status: 200 });
  };

  // Area endpoints
  createArea = async (req: Request, res: Response, next: NextFunction) => {
    const area = await this.createAreaCmd.execute(req.body);
    next({ dto: 'Area', data: area, status: 201 });
  };

  updateArea = async (req: Request, res: Response, next: NextFunction) => {
    const { areaId } = req.params;
    const area = await this.updateAreaCmd.execute(areaId, req.body);
    next({ dto: 'Area', data: area, status: 200 });
  };

  assignAreaAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const { areaId } = req.params;
    const area = await this.assignAreaAdminCmd.execute(areaId, req.body);
    next({ dto: 'Area', data: area, status: 200 });
  };

  getAreaById = async (req: Request, res: Response, next: NextFunction) => {
    const { areaId } = req.params;
    const area = await this.areaService.getAreaById(areaId);
    next({ dto: 'Area', data: area, status: 200 });
  };

  listAreasByForum = async (req: Request, res: Response, next: NextFunction) => {
    const { forumId } = req.params;
    const areas = await this.areaService.listAreasByForum(forumId);
    next({ dto: 'AreaList', data: areas, status: 200 });
  };

  // Unit endpoints
  createUnit = async (req: Request, res: Response, next: NextFunction) => {
    const unit = await this.createUnitCmd.execute(req.body);
    next({ dto: 'Unit', data: unit, status: 201 });
  };

  updateUnit = async (req: Request, res: Response, next: NextFunction) => {
    const { unitId } = req.params;
    const unit = await this.updateUnitCmd.execute(unitId, req.body);
    next({ dto: 'Unit', data: unit, status: 200 });
  };

  assignUnitAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const { unitId } = req.params;
    const unit = await this.assignUnitAdminCmd.execute(unitId, req.body);
    next({ dto: 'Unit', data: unit, status: 200 });
  };

  getUnitById = async (req: Request, res: Response, next: NextFunction) => {
    const { unitId } = req.params;
    const unit = await this.unitService.getUnitById(unitId);
    next({ dto: 'Unit', data: unit, status: 200 });
  };

  listUnitsByArea = async (req: Request, res: Response, next: NextFunction) => {
    const { areaId } = req.params;
    const units = await this.unitService.listUnitsByArea(areaId);
    next({ dto: 'UnitList', data: units, status: 200 });
  };

  listUnitsByForum = async (req: Request, res: Response, next: NextFunction) => {
    const { forumId } = req.params;
    const units = await this.unitService.listUnitsByForum(forumId);
    next({ dto: 'UnitList', data: units, status: 200 });
  };
}
