import { Request, Response, NextFunction } from 'express'
import { ZodTypeAny, ZodError } from 'zod'
import { UnprocessableEntityError } from '@/shared/utils/error-handling/httpErrors'

// Middleware factory to validate request bodies with Zod schemas centrally
export const validateBody = (schema: ZodTypeAny) => async (req: Request, _res: Response, next: NextFunction) => {
  try {
    // parseAsync returns the parsed value; replace req.body with the parsed value
    const parsed = await schema.parseAsync(req.body)
    // Ensure assignment is compatible with Express's any-typed body
    ;(req as any).body = parsed
    return next()
  } catch (err: any) {
    // instanceof may fail across module boundaries; also check err.name
    const isZod = err instanceof ZodError
    if (isZod) {
      const details = err.issues
      return next(new UnprocessableEntityError('Invalid request payload', details))
    }
    return next(err)
  }
}

export default validateBody

// Validate query parameters (req.query)
export const validateQuery = (schema: ZodTypeAny) => async (req: Request, _res: Response, next: NextFunction) => {
  try {
    // parseAsync will validate/coerce query shape; replace req.query
    const parsed = await schema.parseAsync(req.query)
    ;(req as any).query = parsed
    return next()
  } catch (err: any) {
    const isZod = err instanceof ZodError
    if (isZod) {
      const details = err.issues
      return next(new UnprocessableEntityError('Invalid query parameters', details))
    }
    return next(err)
  }
}

// Validate route params (req.params)
export const validateParams = (schema: ZodTypeAny) => async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const parsed = await schema.parseAsync(req.params)
    ;(req as any).params = parsed
    return next()
  } catch (err: any) {
    const isZod = err instanceof ZodError
    if (isZod) {
      const details = err.issues
      return next(new UnprocessableEntityError('Invalid route parameters', details))
    }
    return next(err)
  }
}
