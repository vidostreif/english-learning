const { User } = require('../models/models')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const mailService = require('./mailService')
const tokenService = require('./tokenService')
const UserDto = require('../dtos/userDto')
const ApiError = require('../exceptions/ApiError')

class UserService {
  //регистрация нового пользователя
  async registration(email, password) {
    const candidate = await User.findOne({
      where: { email: email },
    })
    if (candidate) {
      throw ApiError.badRequest(
        `Пользователь с почтовым адресом ${email} уже существует`
      )
    }

    const hashPassword = await bcrypt.hash(password, 3) //создание хеша пароля
    const activationLink = uuid.v4() //генерация случайной строки
    const user = await User.create({
      email: email,
      password: hashPassword,
      activationLink,
    }) //сохранение пользователя

    await mailService.sendActivationMail(
      email,
      `${process.env.API_URL}/api/user/activate/${activationLink}`
    ) //отправка письма с сылкой на активацию

    const userDto = new UserDto(user) //с помощью dto обрезаем модель до трех полей email id isActivated
    const tokens = tokenService.generateTokens({ ...userDto })
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return {
      ...tokens,
      user: userDto,
    }
  }

  //активация пользователя
  async activate(activationLink) {
    const user = await User.findOne({
      where: { activationLink },
    })
    if (!user) {
      throw ApiError.badRequest('Некорректная ссылка активации')
    }
    user.isActivated = true
    await user.save()
  }

  async login(email, password) {
    const user = await User.findOne({
      where: { email: email },
    })
    if (!user) {
      throw ApiError.badRequest(`Пользователь с таким email не найден`)
    }
    //проверяем пароль
    const isPassEquals = await bcrypt.compare(password, user.password)
    if (!isPassEquals) {
      throw ApiError.badRequest(`Не верный пароль`)
    }

    const userDto = new UserDto(user)
    const tokens = tokenService.generateTokens({ ...userDto })
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return {
      ...tokens,
      user: userDto,
    }
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken)
    return token
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError()
    }
    const userData = tokenService.validateRefreshToken(refreshToken)
    const tokenFromDb = await tokenService.findToken(refreshToken)
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError()
    }

    const user = await User.findOne({
      where: { id: userData.id },
    })
    const userDto = new UserDto(user)
    const tokens = tokenService.generateTokens({ ...userDto })
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return {
      ...tokens,
      user: userDto,
    }
  }

  async getAllUsers() {
    const users = await User.findAll()
    return users
  }
}

module.exports = new UserService()
