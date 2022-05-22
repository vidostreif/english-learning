const { User, Task, TaskRating } = require('../db/models')
const ApiError = require('../exceptions/ApiError')

class TaskRatingService {
  //добавление новой оценки
  async add(userId, taskId, rating) {
    const user = await User.findOne({ where: { id: userId } })
    if (!user) {
      throw ApiError.badRequest('Пользователь не найден')
    }

    const task = await Task.findOne({ where: { id: taskId } })
    if (!task) {
      throw ApiError.badRequest('Задание не найдено')
    }

    // await user.removeTaskRating(task)
    await user.addRatingForTask(task, { through: { rating: rating } })

    return rating
  }

  // удаление оценки
  async remove(userId, taskId) {
    const user = await User.findOne({ where: { id: userId } })
    if (!user) {
      throw ApiError.badRequest('Пользователь не найден')
    }

    const task = await Task.findOne({ where: { id: taskId } })
    if (!task) {
      throw ApiError.badRequest('Задание не найдено')
    }

    return await user.removeTaskRating(task)
  }

  // получить все оценки пользователя
  async getAllForUser(userId) {
    const user = await User.findOne({ where: { id: userId } })
    if (!user) {
      throw ApiError.badRequest('Пользователь не найден')
    }

    return await user.getTaskRatings()
  }

  // получить оценку пользователя по конкретному заданию
  async getOneForUser(userId, taskId) {
    if (!taskId) {
      throw ApiError.badRequest('Не задан ID задания')
    }

    if (!userId) {
      throw ApiError.badRequest('Не задан ID пользователя')
    }

    const user = await User.findOne({ where: { id: userId } })
    if (!user) {
      throw ApiError.badRequest('Пользователь не найден')
    }

    const task = await Task.findOne({ where: { id: taskId } })
    if (!task) {
      throw ApiError.badRequest('Задание не найдено')
    }

    return await TaskRating.findOne({
      where: { userId, taskId },
    })
  }
}

module.exports = new TaskRatingService()
