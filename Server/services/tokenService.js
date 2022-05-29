const jwt = require('jsonwebtoken')
const { Token } = require('../db/models')

class TokenService {
  lifetimeAccessToken = 1800 //30 минут в секундах
  lifetimeRefreshToken = '30d' //30 дней
  // генерация новой пары токенов
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: this.lifetimeAccessToken,
    })
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: this.lifetimeRefreshToken,
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
    if (tokenData) {
      tokenData.destroy()
    }

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
