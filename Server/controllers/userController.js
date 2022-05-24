const ApiError = require('../exceptions/ApiError')
const bcrypt = require('bcrypt')
const userService = require('../services/userService')
const { validationResult } = require('express-validator')
class UserController {
  async registration(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw ApiError.badRequest('Ошибка при валидации', errors.array())
    }
    const { email, password } = req.body
    const userData = await userService.registration(email, password)
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    })
    return res.json(userData)
  }

  async login(req, res, next) {
    const { email, password } = req.body
    const userData = await userService.login(email, password)
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    })
    return res.json(userData)
  }

  async logout(req, res, next) {
    const { refreshToken } = req.cookies
    const token = await userService.logout(refreshToken)
    res.clearCookie('refreshToken')
    return res.json(token)
  }

  async activate(req, res, next) {
    const activationLink = req.params.link
    await userService.activate(activationLink)
    return res.redirect(process.env.CLIENT_URL)
  }

  async refresh(req, res, next) {
    const { refreshToken } = req.cookies
    const userData = await userService.refresh(refreshToken)
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    })
    return res.json(userData)
  }

  async getUsers(req, res, next) {
    res.json(await userService.getAllUsers())
  }
}

module.exports = new UserController()
