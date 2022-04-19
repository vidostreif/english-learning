const Dictionary = require('../models/dictionaryModel')
const ApiError = require('../exceptions/ApiError')

class DictionaryController {
  async create(req, res) {
    const { name } = req.body
    const text = await Dictionary.create({ name })
    return res.json(text)
  }

  async delete(req, res) {
    res.json({ message: 'Нужно реализовать DictionaryController!' })
  }

  async getAll(req, res) {
    const texts = await Dictionary.findAll()
    return res.json(texts)
  }

  async getOne(req, res) {
    const { name } = req.query
    if (!name) {
      next(ApiError.badRequest('Не задан Name'))
    }
    const resu = await Dictionary.findOne({
      where: { name: name },
    })
    res.json(resu)
  }
}

module.exports = new DictionaryController()
