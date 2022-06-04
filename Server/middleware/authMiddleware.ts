import { check } from 'express-validator'
import ApiError from '../exceptions/ApiError'
import tokenService from '../services/tokenService'
import { NextFunction, Request, Response } from 'express'

class AuthMiddleware {
  static isAdministarator(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = req.user
      if (!userData || userData.userRole.toString().toLowerCase() !== 'administrator') {
        return next(ApiError.UnauthorizedError())
      }
      next()
    } catch (error) {
      return next(ApiError.UnauthorizedError())
    }
  }

  //проверка авторизации
  static isAuthorized(req: Request, res: Response, next: NextFunction) {
    try {
      const authorizationHeader = req.headers.authorization
      if (!authorizationHeader) {
        return next(ApiError.UnauthorizedError())
      }

      const acccessToken = authorizationHeader.split(' ')[1]
      if (!acccessToken) {
        return next(ApiError.UnauthorizedError())
      }

      const userData = tokenService.validateAccessToken(acccessToken)
      if (!userData) {
        return next(ApiError.UnauthorizedError())
      }

      req.user = userData
      next()
    } catch (error) {
      return next(ApiError.UnauthorizedError())
    }
  }
}

export default AuthMiddleware
