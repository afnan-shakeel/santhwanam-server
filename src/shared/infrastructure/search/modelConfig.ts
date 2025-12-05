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
}
