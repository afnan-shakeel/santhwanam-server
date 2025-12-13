import { permissionService, roleService, inviteUserHandler } from '../index';
import { PermissionDto, PermissionsSearchResponseDto } from './dtos/permissionDtos';
import { RoleDto, RolesSearchResponseDto } from './dtos/roleDtos';
import { UserDto } from './dtos/userDtos';
export async function searchPermissions(req, res, next) {
    try {
        const result = await permissionService.searchPermissions(req.body);
        // Forward raw result to the global response handler for validation/mapping
        return next({ dto: PermissionsSearchResponseDto, data: result, status: 200 });
    }
    catch (err) {
        next(err);
    }
}
export async function createPermission(req, res, next) {
    try {
        // request body is already validated and parsed by centralized middleware
        const p = await permissionService.createPermission(req.body);
        return next({ dto: PermissionDto, data: p, status: 201 });
    }
    catch (err) {
        next(err);
    }
}
export async function updatePermission(req, res, next) {
    try {
        const id = req.params.id;
        const p = await permissionService.updatePermission(id, req.body);
        return next({ dto: PermissionDto, data: p, status: 200 });
    }
    catch (err) {
        next(err);
    }
}
export async function searchRoles(req, res, next) {
    try {
        const result = await roleService.searchRoles(req.body);
        return next({ dto: RolesSearchResponseDto, data: result, status: 200 });
    }
    catch (err) {
        next(err);
    }
}
export async function getRole(req, res, next) {
    try {
        const id = req.params.id;
        const r = await roleService.getRoleById(id);
        return next({ dto: RoleDto, data: r, status: 200 });
    }
    catch (err) {
        next(err);
    }
}
export async function createRole(req, res, next) {
    try {
        // request body is already validated and parsed by centralized middleware
        const r = await roleService.createRole(req.body);
        return next({ dto: RoleDto, data: r, status: 201 });
    }
    catch (err) {
        next(err);
    }
}
export async function inviteUser(req, res, next) {
    try {
        const payload = req.body;
        const created = await inviteUserHandler.execute(payload);
        return next({ dto: UserDto, data: created, status: 201 });
    }
    catch (err) {
        next(err);
    }
}
export async function searchUsers(req, res, next) {
    try {
        // request validated by middleware
        const result = await (await import('../index')).userService.searchUsers(req.body);
        return next({ dto: (await import('./dtos/userDtos')).UsersSearchResponseDto, data: result, status: 200 });
    }
    catch (err) {
        next(err);
    }
}
export async function updateUser(req, res, next) {
    try {
        const id = req.params.id;
        const updated = await (await import('../index')).userService.updateUser(id, req.body);
        return next({ dto: UserDto, data: updated, status: 200 });
    }
    catch (err) {
        next(err);
    }
}
export async function getUser(req, res, next) {
    try {
        const id = req.params.id;
        const u = await (await import('../index')).userService.getUserById(id);
        return next({ dto: UserDto, data: u, status: 200 });
    }
    catch (err) {
        next(err);
    }
}
export async function updateRole(req, res, next) {
    try {
        const id = req.params.id;
        const r = await roleService.updateRole(id, req.body);
        return next({ dto: RoleDto, data: r, status: 200 });
    }
    catch (err) {
        next(err);
    }
}
