// import { Task, Marker, Dictionary, User } from '../db/models'
// import { Sequelize, Op } from 'sequelize'
import { NextFunction, Request, Response } from 'express'
import taskService from '../services/taskService'

class TaskController {
  async addOrUpdate(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userId = req.user.id
    const { complexity, markers, id } = req.body
    const files = req.files

    res.json(await taskService.addOrUpdate(+userId, +id, +complexity, markers, files))
  }

  async destroyOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params

    res.json(await taskService.destroyOne(+id))
  }

  async restoreOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params

    res.json(await taskService.restoreOne(+id))
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    let { limit, page, complexity, sort } = req.query

    res.json(await taskService.getAll(+limit, +page, +complexity, sort.toString()))
  }

  async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params

    res.json(await taskService.getOne(+id))
  }

  async getRandom(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { not_id, count } = req.query

    res.json(await taskService.getRandom(+count, +not_id))
  }

  // увеличение счетчика прохождения задания
  async wasPassed(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params

    res.json(await taskService.wasPassed(+id))
  }
}

export default new TaskController()
