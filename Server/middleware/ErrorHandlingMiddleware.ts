import ApiError from '../exceptions/ApiError'
import { NextFunction, Request, Response, ErrorRequestHandler } from 'express'

//перехват ошибок
export default function (err: unknown, req: Request, res: Response, next: NextFunction): Response {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message, errors: err.errors })
  }
  return res.status(500).json({ message: 'Непредвиденная ошибка!' })
}
