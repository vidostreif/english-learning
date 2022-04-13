const ApiError = require('../error/ApiError')
class UserController {
  async registration(req, res) {
    res.json({ message: 'Нужно реализовать авторизацию!' })
  }

  async login(req, res) {
    res.json({ message: 'Нужно реализовать авторизацию!' })
  }

  async check(req, res, next) {
    const { id } = req.query
    if (!id) {
      return next(ApiError.badRequest('Не задан ID'))
    }
    res.json(id)
  }
}

module.exports = new UserController()
