const ApiError = require('../exceptions/ApiError')
const tokenService = require('../services/tokenService')

//проверка авторизации
module.exports = function (req, res, next) {
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
