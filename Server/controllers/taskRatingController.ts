import taskRatingService from '../services/taskRatingService'
import { NextFunction, Request, Response } from 'express'

class TaskRatingController {
  //добавление оценки задания от пользователя
  async addUserTaskRating(req: Request, res: Response, next: NextFunction) {
    const userId = req.user.id
    const { taskId, rating } = req.body

    return res.json({
      rating: await taskRatingService.add(userId, taskId, rating),
    })
  }

  // удаление оценки пользователя
  async removeUserTaskRating(req: Request, res: Response, next: NextFunction) {
    const userId = req.user.id
    const { taskId } = req.body

    await taskRatingService.remove(userId, taskId)

    return res.status(200).json({ message: 'Оценка удалена' })
  }

  // получить все оценки пользователя
  async getAllUserTaskRatings(req: Request, res: Response, next: NextFunction) {
    const userId = req.user.id

    return res.json(await taskRatingService.getAllForUser(userId))
  }

  // получить оценку пользователя по конкретному заданию
  async getOneUserTaskRating(req: Request, res: Response, next: NextFunction) {
    const userId = req.user.id
    const { id: taskId } = req.params

    return res.json(await taskRatingService.getOneForUser(userId, +taskId))
  }
}

module.exports = new TaskRatingController()
