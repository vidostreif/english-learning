const { User } = require('../models/models')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const mailService = require('./mailService')
const tokenService = require('./tokenService')
const UserDto = require('../dtos/userDto')

class UserService {
  async registration(email, password) {
    const candidate = await User.findOne({
      where: { email: email },
    })
    if (candidate) {
      throw new Error(`Пользователь с почтовым адресом ${email} уже существует`)
    }

    const hashPassword = await bcrypt.hash(password, 3) //создание хеша пароля
    const activationLink = uuid.v4() //генерация случайной строки
    const user = await User.create({
      email: email,
      password: hashPassword,
      activationLink,
    }) //сохранение пользователя

    await mailService.sendActivationMail(email, activationLink) //отправка письма с сылкой на активацию

    const userDto = new UserDto(user) //с помощью dto обрезаем модель до трех полей email id isActivated
    const tokens = tokenService.generateTokens({ ...userDto })
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return {
      ...tokens,
      user: userDto,
    }
  }
}

module.exports = new UserService()
