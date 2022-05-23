const { Dictionary } = require('../db/models')
const ApiError = require('../exceptions/ApiError')

class DictionaryController {
  async create(req, res, next) {
    try {
      const { name } = req.body
      const text = await Dictionary.create({ name })
      return res.json(text)
    } catch (error) {
      if (error instanceof ApiError) {
        next(error)
      }
      next(ApiError.badRequest(error))
    }
  }

  async delete(req, res, next) {
    try {
      res.json({ message: 'Нужно реализовать DictionaryController!' })
    } catch (error) {
      if (error instanceof ApiError) {
        next(error)
      }
      next(ApiError.badRequest(error))
    }
  }

  async getAll(req, res, next) {
    try {
      const texts = await Dictionary.findAll()
      return res.json(texts)
    } catch (error) {
      if (error instanceof ApiError) {
        next(error)
      }
      next(ApiError.badRequest(error))
    }
  }

  async getOne(req, res, next) {
    try {
      const { name } = req.query
      if (!name) {
        next(ApiError.badRequest('Не задан Name'))
      }
      const resu = await Dictionary.findOne({
        where: { name: name },
      })
      res.json(resu)
    } catch (error) {
      if (error instanceof ApiError) {
        next(error)
      }
      next(ApiError.badRequest(error))
    }
  }
}

module.exports = new DictionaryController()
