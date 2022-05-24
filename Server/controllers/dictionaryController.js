const { Dictionary } = require('../db/models')

class DictionaryController {
  async create(req, res, next) {
    const { name } = req.body
    const text = await Dictionary.create({ name })
    return res.json(text)
  }

  async delete(req, res, next) {
    res.json({ message: 'Нужно реализовать DictionaryController!' })
  }

  async getAll(req, res, next) {
    const texts = await Dictionary.findAll()
    return res.json(texts)
  }

  async getOne(req, res, next) {
    const { name } = req.query
    if (!name) {
      throw new Error('Не задан Name')
    }
    const resu = await Dictionary.findOne({
      where: { name: name },
    })
    res.json(resu)
  }
}

module.exports = new DictionaryController()
