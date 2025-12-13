import { ModelConfigs } from './types'

export const modelConfigs: ModelConfigs = {
  User: {
    searchable: ['firstName', 'lastName', 'email'],
    sortable: ['createdAt', 'lastSyncedAt', 'firstName', 'lastName', 'email'],
    filters: ['isActive', 'createdAt', 'email', 'firstName', 'lastName'],
    relations: ['userRoles'],
  },
  Role: {
    searchable: ['roleCode', 'roleName', 'description'],
    sortable: ['createdAt', 'updatedAt', 'roleCode', 'roleName'],
    filters: ['isActive', 'isSystemRole', 'scopeType', 'createdAt', 'roleCode'],
    relations: ['rolePermissions', 'userRoles'],
  },
  Permission: {
    searchable: ['permissionCode', 'permissionName', 'description', 'module'],
    sortable: ['createdAt', 'permissionCode', 'permissionName', 'module'],
    filters: ['isActive', 'module', 'action', 'createdAt', 'permissionCode'],
    relations: ['rolePermissions'],
  },
  Forum: {
    searchable: ['forumName', 'forumCode'],
    sortable: ['createdAt', 'forumName'],
    filters: ['isActive', 'createdAt', 'forumName', 'forumCode','adminUserId'],
    relations: ['areas'],
  },
  Area: {
    searchable: ['areaName'],
    sortable: ['createdAt', 'areaName'],
    filters: ['isActive', 'createdAt', 'areaName', 'forumId', 'forum.forumCode', 'forum.forumName'],
    relations: ['units'],
  },
  Unit: {
    searchable: ['unitName'],
    sortable: ['createdAt', 'unitName'],
    filters: ['isActive', 'createdAt', 'unitName', 'areaId', 'forumId'],
    relations: ['agents', 'members'],
  },
}
