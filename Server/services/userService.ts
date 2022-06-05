import { User, UserRole } from '../db/models'
import bcrypt from 'bcrypt'
import uuid from 'uuid'
import mailService from './mailService'
import tokenService from './tokenService'
import ApiError from '../exceptions/ApiError'
import UserDto from '../dtos/userDto'

class UserService {
  //регистрация нового пользователя
  async registration(email: string, password: string) {
    const candidate = await User.findOne({
      where: { email: email },
    })
    if (candidate) {
      throw new Error(`Пользователь с почтовым адресом ${email} уже существует`)
    }

    const hashPassword = await bcrypt.hash(password, 3) //создание хеша пароля
    const activationLink = uuid.v4() //генерация случайной строки

    //если пользователь указан админскую почту, то даем ему админские права
    let role = 'user'
    if (email === process.env.DB_ADMINISTRATOR_EMAIL) {
      role = 'administrator'
    }
    const userRole = await UserRole.findOne({ where: { name: role } })

    let user = await User.scope('role').create({
      email,
      password: hashPassword,
      activationLink,
      userRoleId: userRole.id,
    }) //сохранение пользователя

    user = await User.scope('role').findOne({ where: { id: user.id } })

    await mailService.sendActivationMail(email, `${process.env.API_URL}/api/user/activate/${activationLink}`) //отправка письма с сылкой на активацию

    const userDto = new UserDto(user) //с помощью dto обрезаем модель
    const tokens = tokenService.generateTokens({ ...userDto })
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return {
      ...tokens,
      lifetimeAccessToken: tokenService.lifetimeAccessToken,
      user: userDto,
      // role: role,
    }
  }

  //активация пользователя
  async activate(activationLink: string) {
    const user = await User.findOne({
      where: { activationLink },
    })
    if (!user) {
      throw new Error('Некорректная ссылка активации')
    }
    user.isActivated = true
    await user.save()
  }

  async login(email: string, password: string) {
    const user = await User.scope('role').findOne({
      where: { email: email },
    })

    if (!user) {
      throw new Error(`Пользователь с таким email не найден`)
    }
    //проверяем пароль
    const isPassEquals = await bcrypt.compare(password, user.password)
    if (!isPassEquals) {
      throw new Error(`Не верный пароль`)
    }

    const userDto = new UserDto(user)
    const tokens = tokenService.generateTokens({ ...userDto })
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return {
      ...tokens,
      lifetimeAccessToken: tokenService.lifetimeAccessToken,
      user: userDto,
    }
  }

  async logout(refreshToken: string) {
    const token = await tokenService.removeToken(refreshToken)
    return token
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError()
    }
    const userData: UserDto = tokenService.validateRefreshToken(refreshToken) as UserDto
    const tokenFromDb = await tokenService.findToken(refreshToken)
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError()
    }

    const user = await User.scope('role').findOne({
      where: { id: userData.id },
    })
    const userDto = new UserDto(user)
    const tokens = tokenService.generateTokens({ ...userDto })
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return {
      ...tokens,
      lifetimeAccessToken: tokenService.lifetimeAccessToken,
      user: userDto,
    }
  }

  async getAllUsers() {
    const users = await User.scope('role').findAll()
    return users
  }
}

export default new UserService()
