const { TaskRating, User, Task } = require('../db/models')
const ApiError = require('../exceptions/ApiError')
const taskRatingService = require('../services/taskRatingService')

class TaskRatingController {
  //добавление оценки задания от пользователя
  async addUserTaskRating(req, res, next) {
    try {
      const userId = req.user.id
      const { taskId, rating } = req.body

      return res.json({
        rating: await taskRatingService.add(userId, taskId, rating),
      })
    } catch (error) {
      next(ApiError.badRequest(error))
    }
  }

  // удаление оценки пользователя
  async removeUserTaskRating(req, res, next) {
    try {
      const userId = req.user.id
      const { taskId } = req.body

      await taskRatingService.remove(userId, taskId)

      return res.status(200).json({ message: 'Оценка удалена' })
    } catch (error) {
      next(ApiError.badRequest(error))
    }
  }

  // получить все оценки пользователя
  async getAllUserTaskRatings(req, res, next) {
    try {
      const userId = req.user.id

      return res.json(await taskRatingService.getAllForUser(userId))
    } catch (error) {
      next(ApiError.badRequest(error))
    }
  }

  // получить оценку пользователя по конкретному заданию
  async getOneUserTaskRating(req, res, next) {
    try {
      const userId = req.user.id
      const { id: taskId } = req.params

      return res.json(await taskRatingService.getOneForUser(userId, taskId))
    } catch (error) {
      next(ApiError.badRequest(error))
    }
  }
}

module.exports = new TaskRatingController()
