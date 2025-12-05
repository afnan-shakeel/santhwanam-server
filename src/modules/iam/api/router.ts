import { Router } from 'express'
import * as ctrl from './controller'
import { validateBody } from '@/shared/middleware/validateZod'
import { createPermissionSchema, createRoleSchema } from './validators'
import { searchValidationSchema } from '@/shared/validators/searchValidator'

const router = Router()

// Permissions
router.post('/permissions/search', validateBody(searchValidationSchema), ctrl.searchPermissions)
router.post('/permissions', validateBody(createPermissionSchema), ctrl.createPermission)

// Roles
router.post('/roles/search', validateBody(searchValidationSchema), ctrl.searchRoles)
router.post('/roles', validateBody(createRoleSchema), ctrl.createRole)

export default router
