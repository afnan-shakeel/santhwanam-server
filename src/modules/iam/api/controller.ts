import { Request, Response, NextFunction } from 'express'
import { permissionService, roleService } from '../index'

export async function searchPermissions(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await permissionService.searchPermissions(req.body)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export async function createPermission(req: Request, res: Response, next: NextFunction) {
  try {
    // request body is already validated and parsed by centralized middleware
    const p = await permissionService.createPermission(req.body)
    res.status(201).json(p)
  } catch (err) {
    next(err)
  }
}

export async function searchRoles(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await roleService.searchRoles(req.body)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export async function createRole(req: Request, res: Response, next: NextFunction) {
  try {
    // request body is already validated and parsed by centralized middleware
    const r = await roleService.createRole(req.body)
    res.status(201).json(r)
  } catch (err) {
    next(err)
  }
}
