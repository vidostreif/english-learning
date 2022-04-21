const ApiError = require('../exceptions/ApiError')
const bcrypt = require('bcrypt')
const userService = require('../services/userService')
const { validationResult } = require('express-validator')
class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(ApiError.badRequest('Ошибка при валидации', errors.array()))
      }
      const { email, password } = req.body
      const userData = await userService.registration(email, password)
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })
      return res.json(userData)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body
      const userData = await userService.login(email, password)
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })
      return res.json(userData)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      const token = await userService.logout(refreshToken)
      res.clearCookie('refreshToken')
      return res.json(token)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link
      await userService.activate(activationLink)
      return res.redirect(process.env.CLIENT_URL)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      const userData = await userService.refresh(refreshToken)
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })
      return res.json(userData)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  async getUsers(req, res, next) {
    try {
      res.json(await userService.getAllUsers())
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}

module.exports = new UserController()
