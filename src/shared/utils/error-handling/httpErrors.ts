import AppError from './AppError'

// Standard shape for Conflict (409) error details
export type ConflictDetail = {
  field: string // error field name (e.g. 'permissionCode')
  displayField: string // human-friendly field name (e.g. 'Permission Code')
  message?: string // optional readable message (e.g. 'permission code already exists')
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad Request', details?: any) {
    super(message, 400, details)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized', details?: any) {
    super(message, 401, details)
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden', details?: any) {
    super(message, 403, details)
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Not Found', details?: any) {
    super(message, 404, details)
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict', details?: ConflictDetail) {
    super(message, 409, details)
  }
}

export class UnprocessableEntityError extends AppError {
  constructor(message = 'Unprocessable Entity', details?: any) {
    super(message, 422, details)
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Internal Server Error', details?: any) {
    super(message, 500, details)
  }
}

export default {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  UnprocessableEntityError,
  InternalServerError,
}
