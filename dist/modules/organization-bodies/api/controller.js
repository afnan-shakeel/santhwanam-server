/**
 * Controller for Organization Bodies API
 */
import { ForumDto, ForumListDto, ForumsSearchResponseDto } from './dtos/forumDtos';
import { AreaDto, AreaListDto, AreasSearchResponseDto } from './dtos/areaDtos';
import { UnitDto, UnitListDto, UnitsSearchResponseDto } from './dtos/unitDtos';
export class OrganizationBodiesController {
    forumService;
    areaService;
    unitService;
    createForumCmd;
    updateForumCmd;
    assignForumAdminCmd;
    createAreaCmd;
    updateAreaCmd;
    assignAreaAdminCmd;
    createUnitCmd;
    updateUnitCmd;
    assignUnitAdminCmd;
    constructor(forumService, areaService, unitService, createForumCmd, updateForumCmd, assignForumAdminCmd, createAreaCmd, updateAreaCmd, assignAreaAdminCmd, createUnitCmd, updateUnitCmd, assignUnitAdminCmd) {
        this.forumService = forumService;
        this.areaService = areaService;
        this.unitService = unitService;
        this.createForumCmd = createForumCmd;
        this.updateForumCmd = updateForumCmd;
        this.assignForumAdminCmd = assignForumAdminCmd;
        this.createAreaCmd = createAreaCmd;
        this.updateAreaCmd = updateAreaCmd;
        this.assignAreaAdminCmd = assignAreaAdminCmd;
        this.createUnitCmd = createUnitCmd;
        this.updateUnitCmd = updateUnitCmd;
        this.assignUnitAdminCmd = assignUnitAdminCmd;
    }
    // Forum endpoints
    createForum = async (req, res, next) => {
        try {
            const forum = await this.createForumCmd.execute(req.body);
            return next({ dto: ForumDto, data: forum, status: 201 });
        }
        catch (err) {
            next(err);
        }
    };
    updateForum = async (req, res, next) => {
        try {
            const { forumId } = req.params;
            const forum = await this.updateForumCmd.execute(forumId, req.body);
            return next({ dto: ForumDto, data: forum, status: 200 });
        }
        catch (err) {
            next(err);
        }
    };
    assignForumAdmin = async (req, res, next) => {
        try {
            const { forumId } = req.params;
            const forum = await this.assignForumAdminCmd.execute(forumId, req.body);
            return next({ dto: ForumDto, data: forum, status: 200 });
        }
        catch (err) {
            next(err);
        }
    };
    getForumById = async (req, res, next) => {
        try {
            const { forumId } = req.params;
            const forum = await this.forumService.getForumById(forumId);
            return next({ dto: ForumDto, data: forum, status: 200 });
        }
        catch (err) {
            next(err);
        }
    };
    getForumByCode = async (req, res, next) => {
        try {
            const { forumCode } = req.params;
            const forum = await this.forumService.getForumByCode(forumCode);
            return next({ dto: ForumDto, data: forum, status: 200 });
        }
        catch (err) {
            next(err);
        }
    };
    listForums = async (req, res, next) => {
        try {
            const forums = await this.forumService.listForums();
            return next({ dto: ForumListDto, data: forums, status: 200 });
        }
        catch (err) {
            next(err);
        }
    };
    // Area endpoints
    createArea = async (req, res, next) => {
        try {
            const area = await this.createAreaCmd.execute(req.body);
            return next({ dto: AreaDto, data: area, status: 201 });
        }
        catch (err) {
            next(err);
        }
    };
    updateArea = async (req, res, next) => {
        try {
            const { areaId } = req.params;
            const area = await this.updateAreaCmd.execute(areaId, req.body);
            return next({ dto: AreaDto, data: area, status: 200 });
        }
        catch (err) {
            next(err);
        }
    };
    assignAreaAdmin = async (req, res, next) => {
        try {
            const { areaId } = req.params;
            const area = await this.assignAreaAdminCmd.execute(areaId, req.body);
            return next({ dto: AreaDto, data: area, status: 200 });
        }
        catch (err) {
            next(err);
        }
    };
    getAreaById = async (req, res, next) => {
        try {
            const { areaId } = req.params;
            const area = await this.areaService.getAreaById(areaId);
            return next({ dto: AreaDto, data: area, status: 200 });
        }
        catch (err) {
            next(err);
        }
    };
    listAreasByForum = async (req, res, next) => {
        try {
            const { forumId } = req.params;
            const areas = await this.areaService.listAreasByForum(forumId);
            return next({ dto: AreaListDto, data: areas, status: 200 });
        }
        catch (err) {
            next(err);
        }
    };
    // Unit endpoints
    createUnit = async (req, res, next) => {
        try {
            const unit = await this.createUnitCmd.execute(req.body);
            return next({ dto: UnitDto, data: unit, status: 201 });
        }
        catch (err) {
            next(err);
        }
    };
    updateUnit = async (req, res, next) => {
        try {
            const { unitId } = req.params;
            const unit = await this.updateUnitCmd.execute(unitId, req.body);
            return next({ dto: UnitDto, data: unit, status: 200 });
        }
        catch (err) {
            next(err);
        }
    };
    assignUnitAdmin = async (req, res, next) => {
        try {
            const { unitId } = req.params;
            const unit = await this.assignUnitAdminCmd.execute(unitId, req.body);
            return next({ dto: UnitDto, data: unit, status: 200 });
        }
        catch (err) {
            next(err);
        }
    };
    getUnitById = async (req, res, next) => {
        try {
            const { unitId } = req.params;
            const unit = await this.unitService.getUnitById(unitId);
            return next({ dto: UnitDto, data: unit, status: 200 });
        }
        catch (err) {
            next(err);
        }
    };
    listUnitsByArea = async (req, res, next) => {
        try {
            const { areaId } = req.params;
            const units = await this.unitService.listUnitsByArea(areaId);
            return next({ dto: UnitListDto, data: units, status: 200 });
        }
        catch (err) {
            next(err);
        }
    };
    listUnitsByForum = async (req, res, next) => {
        try {
            const { forumId } = req.params;
            const units = await this.unitService.listUnitsByForum(forumId);
            return next({ dto: UnitListDto, data: units, status: 200 });
        }
        catch (err) {
            next(err);
        }
    };
    // Search endpoints
    searchForums = async (req, res, next) => {
        try {
            const result = await this.forumService.searchForums(req.body);
            return next({ dto: ForumsSearchResponseDto, data: result, status: 200 });
        }
        catch (err) {
            next(err);
        }
    };
    searchAreas = async (req, res, next) => {
        try {
            const result = await this.areaService.searchAreas(req.body);
            return next({ dto: AreasSearchResponseDto, data: result, status: 200 });
        }
        catch (err) {
            next(err);
        }
    };
    searchUnits = async (req, res, next) => {
        try {
            const result = await this.unitService.searchUnits(req.body);
            return next({ dto: UnitsSearchResponseDto, data: result, status: 200 });
        }
        catch (err) {
            next(err);
        }
    };
}
