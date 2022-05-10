const { check } = require('express-validator')
const ApiError = require('../exceptions/ApiError')
const tokenService = require('../services/tokenService')

class AuthMiddleware {
  static isAdministarator(req, res, next) {
    try {
      const userData = req.user
      if (!userData || userData.userRole.toLowerCase() !== 'administrator') {
        return next(ApiError.UnauthorizedError())
      }
      next()
    } catch (error) {
      return next(ApiError.UnauthorizedError())
    }
  }

  //проверка авторизации
  static isAuthorized(req, res, next) {
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

module.exports = AuthMiddleware
