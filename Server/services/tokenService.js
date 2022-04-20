const jwt = require('jsonwebtoken')
const { Token } = require('../models/models')

class TokenService {
  // генерация новой пары токенов
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '5s',
    })
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '10s',
    })

    return {
      accessToken,
      refreshToken,
    }
  }

  //проверка валидности токена доступа
  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
      return userData
    } catch (error) {
      return null
    }
  }

  //проверка валидности токена обновления
  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
      return userData
    } catch (error) {
      return null
    }
  }

  // сохранение refreshToken в БД
  async saveToken(userId, refreshToken) {
    const tokenData = await Token.findOne({
      where: { userId: userId },
    })

    //если нашли токен пользователя, то перезаписываем новый
    if (tokenData) {
      tokenData.refreshToken = refreshToken
      return tokenData.save()
    }
    //если не нашли, то создаем новый
    const token = await Token.create({ userId, refreshToken })
    return token
  }

  // удаление токена из БД
  async removeToken(refreshToken) {
    const tokenData = await Token.findOne({
      where: { refreshToken },
    })
    tokenData.destroy()
    return tokenData
  }

  async findToken(refreshToken) {
    const tokenData = await Token.findOne({
      where: { refreshToken },
    })
    return tokenData
  }
}

module.exports = new TokenService()
