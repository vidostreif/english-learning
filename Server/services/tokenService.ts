import jwt from 'jsonwebtoken'
// import { Token } from '../db/models'
import { prismaClient, Prisma } from '../prisma/prismaClient'

type Token = Prisma.TokenGetPayload<{}>

class TokenService {
  lifetimeAccessToken: number = 1800 //30 минут в секундах
  lifetimeRefreshToken: string = '30d' //30 дней
  // генерация новой пары токенов
  generateTokens(payload: string | object | Buffer): { accessToken: string; refreshToken: string } {
    const accessToken: string = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: this.lifetimeAccessToken,
    })
    const refreshToken: string = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: this.lifetimeRefreshToken,
    })

    return {
      accessToken,
      refreshToken,
    }
  }

  //проверка валидности токена доступа
  validateAccessToken(token: string) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
      return userData
    } catch (error) {
      return null
    }
  }

  //проверка валидности токена обновления
  validateRefreshToken(token: any) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
      return userData
    } catch (error) {
      return null
    }
  }

  // сохранение refreshToken в БД
  async saveToken(userId: any, refreshToken: any): Promise<Token> {
    const tokenData = await prismaClient.token.findFirst({
      where: { userId: userId },
    })

    // const tokenData = await Token.findOne({
    //   where: { userId: userId },
    // })

    //если нашли токен пользователя, то перезаписываем
    if (tokenData) {
      return await prismaClient.token.update({ where: { id: tokenData.id }, data: { refreshToken } })
      // tokenData.refreshToken = refreshToken
      // return tokenData.save()
    }
    //если не нашли, то создаем новый
    return await prismaClient.token.create({ data: { userId, refreshToken } })
    // const token = await Token.create({ userId, refreshToken })
    // return token
  }

  // удаление токена из БД
  async removeToken(refreshToken: any) {
    return await prismaClient.token.deleteMany({
      where: { refreshToken },
    })

    // const tokenData = await Token.findOne({
    //   where: { refreshToken },
    // })
    // if (tokenData) {
    //   tokenData.destroy()
    // }

    // return tokenData
  }

  async findToken(refreshToken: any): Promise<Token> {
    return await prismaClient.token.findFirst({
      where: { refreshToken },
    })

    // const tokenData = await Token.findOne({
    //   where: { refreshToken },
    // })
    // return tokenData
  }
}

export default new TokenService()
