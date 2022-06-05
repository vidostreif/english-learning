import { Dictionary } from '../db/models'
import { NextFunction, Request, Response } from 'express'

class DictionaryController {
  async create(req: Request, res: Response, next: NextFunction) {
    const { name } = req.body
    const text = await Dictionary.create({ name })
    return res.json(text)
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    return res.json({ message: 'Нужно реализовать DictionaryController!' })
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    const texts = await Dictionary.findAll()
    return res.json(texts)
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    const { name } = req.query
    if (!name) {
      throw new Error('Не задан Name')
    }
    const resu = await Dictionary.findOne({ where: { name: name.toString() } })
    return res.json(resu)
  }
}

export default new DictionaryController()
