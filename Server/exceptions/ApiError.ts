import { NextFunction, Request, Response } from 'express'
import { ValidationError } from 'express-validator'

class ApiError extends Error {
  status: number
  errors: Array<string | ValidationError>

  constructor(status: number, message: string, errors: Array<string | ValidationError> = []) {
    super(message)
    this.status = status
    this.errors = errors
  }

  //оболочка для выполнения кода в контроллерах
  static tryShell(callback: (req: Request, res: Response, next: NextFunction) => any): any {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        return await callback(req, res, next)
      } catch (error) {
        console.log(error)
        if (error instanceof ApiError) {
          next(error)
        }
        next(ApiError.badRequest(error.message))
      }
    }
  }

  static UnauthorizedError(): ApiError {
    return new ApiError(401, 'Пользователь не авторизован')
  }

  static badRequest(message: string, errors: Array<ValidationError> = []): ApiError {
    return new ApiError(404, message, errors)
  }

  static internal(message: string): ApiError {
    return new ApiError(500, message)
  }

  static forbidden(message: string): ApiError {
    return new ApiError(403, message)
  }
}

export default ApiError
