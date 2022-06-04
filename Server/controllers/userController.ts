import ApiError from '../exceptions/ApiError'
import bcrypt from 'bcrypt'
import userService from '../services/userService'
import { validationResult } from 'express-validator'
import { NextFunction, Request, Response } from 'express'

const maxAge = 2592000000 // один месяц
class UserController {
  async registration(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw ApiError.badRequest('Ошибка при валидации', errors.array())
    }
    const { email, password } = req.body
    const userData = await userService.registration(email, password)
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge,
      httpOnly: true,
    })
    return res.json(userData)
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body
    const userData = await userService.login(email, password)
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge,
      httpOnly: true,
    })
    return res.json(userData)
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    const { refreshToken } = req.cookies
    const token = await userService.logout(refreshToken)
    res.clearCookie('refreshToken')
    return res.json(token)
  }

  async activate(req: Request, res: Response, next: NextFunction) {
    const activationLink = req.params.link
    await userService.activate(activationLink)
    return res.redirect(process.env.CLIENT_URL)
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    const { refreshToken } = req.cookies
    const userData = await userService.refresh(refreshToken)
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge,
      httpOnly: true,
    })
    return res.json(userData)
  }

  async getUsers(req: Request, res: Response, next: NextFunction) {
    res.json(await userService.getAllUsers())
  }
}

export default new UserController()
