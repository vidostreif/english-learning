const jwt = require('jsonwebtoken')
const { Token } = require('../models/models')

class TokenService {
  // генерация новой пары токенов
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '30m',
    })
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '30d',
    })

    return {
      accessToken,
      refreshToken,
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
}

module.exports = new TokenService()
