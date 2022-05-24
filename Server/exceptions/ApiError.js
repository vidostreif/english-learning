class ApiError extends Error {
  constructor(status, message, errors = []) {
    super(message)
    this.status = status
    this.errors = errors
  }

  //оболочка для выполнения кода в контроллерах
  static tryShell(callback) {
    return async (req, res, next) => {
      try {
        return await callback(req, res, next)
      } catch (error) {
        if (error instanceof ApiError) {
          next(error)
        }
        next(ApiError.badRequest(error.message))
      }
    }
  }

  static UnauthorizedError() {
    return new ApiError(401, 'Пользователь не авторизован')
  }

  static badRequest(message, errors = []) {
    return new ApiError(404, message, errors)
  }

  static internal(message) {
    return new ApiError(500, message)
  }

  static forbidden(message) {
    return new ApiError(403, message)
  }
}

module.exports = ApiError
