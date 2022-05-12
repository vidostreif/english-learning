const { TaskRating, User, Task } = require('../db/models')
const ApiError = require('../exceptions/ApiError')

class TaskRatingController {
  //добавление оценки задания от пользователя
  async addUserTaskRating(req, res, next) {
    try {
      const userId = req.user.id
      const { taskId, rating } = req.body

      const user = await User.findOne({ where: { id: userId } })
      if (!user) {
        next(ApiError.badRequest('Пользователь не найден'))
      }

      const task = await Task.findOne({ where: { id: taskId } })
      if (!task) {
        next(ApiError.badRequest('Задание не найдено'))
      }

      const taskRating = await TaskRating.findOne({
        where: {
          userId,
          taskId,
        },
      })

      if (taskRating) {
        await taskRating.update({
          rating: rating,
          userId,
          taskId,
        })
      } else {
        await TaskRating.create({
          rating: rating,
          userId,
          taskId,
        })
      }
      // await TaskRating.removeTaskRating(task)
      // await user.addTaskRating(task, { through: { rating: rating } })

      return res.json({
        rating: rating,
      })
    } catch (error) {
      console.log(error)
      next(ApiError.badRequest(error))
    }
  }

  // удаление оценки пользователя
  async removeUserTaskRating(req, res, next) {
    try {
      const userId = req.user.id
      const { taskId } = req.body

      const user = await User.findOne({ where: { id: userId } })
      if (!user) {
        next(ApiError.badRequest('Пользователь не найден'))
      }

      const task = await Task.findOne({ where: { id: taskId } })
      if (!task) {
        next(ApiError.badRequest('Задание не найдено'))
      }

      await user.removeTaskRating(task)

      return res.status(200).json({ message: 'Оценка удалена' })
    } catch (error) {
      next(ApiError.badRequest(error))
    }
  }

  // получить все оценки пользователя
  async getAllUserTaskRatings(req, res, next) {
    try {
      const userId = req.user.id

      const user = await User.findOne({ where: { id: userId } })
      if (!user) {
        next(ApiError.badRequest('Пользователь не найден'))
      }

      const taskRatings = await user.getTaskRatings()

      return res.json(taskRatings)
    } catch (error) {
      next(ApiError.badRequest(error))
    }
  }

  // получить оценку пользователя по конкретному заданию
  async getOneUserTaskRating(req, res, next) {
    try {
      const userId = req.user.id
      const { id: taskId } = req.params
      if (!taskId) {
        next(ApiError.badRequest('Не задан ID'))
      }

      const user = await User.findOne({ where: { id: userId } })
      if (!user) {
        next(ApiError.badRequest('Пользователь не найден'))
      }

      const task = await Task.findOne({ where: { id: taskId } })
      if (!task) {
        next(ApiError.badRequest('Задание не найдено'))
      }

      const rating = await TaskRating.findOne({
        where: { userId, taskId },
      })

      return res.json(rating)
    } catch (error) {
      console.log(error)
      next(ApiError.badRequest(error))
    }
  }
}

module.exports = new TaskRatingController()
