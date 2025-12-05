import { z } from 'zod'

export const createPermissionSchema = z.object({
  permissionCode: z.string().min(1),
  permissionName: z.string().min(1),
  description: z.string().optional(),
  module: z.string().optional(),
  action: z.string().optional(),
})

export const createRoleSchema = z.object({
  roleCode: z.string().min(1),
  roleName: z.string().min(1),
  description: z.string().optional().nullable(),
  scopeType: z.enum(['None', 'Forum', 'Area', 'Unit', 'Agent']),
  isSystemRole: z.boolean().optional(),
})
