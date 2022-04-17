const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const userService = require('../services/userService')
class UserController {
  async registration(req, res, next) {
    try {
      const { email, password } = req.body
      const userData = await userService.registration(email, password)
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })
      return res.json(userData)
    } catch (error) {
      next(ApiError.badRequest(error.message))
    }
  }

  async login(req, res, next) {
    try {
      res.json({ message: 'Нужно реализовать авторизацию!' })
    } catch (error) {
      next(ApiError.badRequest(error.message))
    }
  }

  async logout(req, res, next) {
    // const { id } = req.query
    // if (!id) {
    //   return next(ApiError.badRequest('Не задан ID'))
    // }
    // res.json(id)

    try {
      res.json({ message: 'Нужно реализовать авторизацию!' })
    } catch (error) {
      next(ApiError.badRequest(error.message))
    }
  }

  async activate(req, res, next) {
    try {
      res.json({ message: 'Нужно реализовать авторизацию!' })
    } catch (error) {
      next(ApiError.badRequest(error.message))
    }
  }

  async refresh(req, res, next) {
    try {
      res.json({ message: 'Нужно реализовать авторизацию!' })
    } catch (error) {
      next(ApiError.badRequest(error.message))
    }
  }

  async getUsers(req, res, next) {
    try {
      res.json({ message: 'Нужно реализовать авторизацию!' })
    } catch (error) {
      next(ApiError.badRequest(error.message))
    }
  }
}

module.exports = new UserController()
