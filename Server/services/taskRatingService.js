const { User, Task, TaskRating } = require('../db/models')

class TaskRatingService {
  //добавление новой оценки
  async add(userId, taskId, rating) {
    const user = await User.findOne({ where: { id: userId } })
    if (!user) {
      throw new Error('Пользователь не найден')
    }

    const task = await Task.findOne({ where: { id: taskId } })
    if (!task) {
      throw new Error('Задание не найдено')
    }

    // await user.removeTaskRating(task)
    await user.addRatingForTask(task, { through: { rating: rating } })

    return rating
  }

  // удаление оценки
  async remove(userId, taskId) {
    const user = await User.findOne({ where: { id: userId } })
    if (!user) {
      throw new Error('Пользователь не найден')
    }

    const task = await Task.findOne({ where: { id: taskId } })
    if (!task) {
      throw new Error('Задание не найдено')
    }

    return await user.removeTaskRating(task)
  }

  // получить все оценки пользователя
  async getAllForUser(userId) {
    const user = await User.findOne({ where: { id: userId } })
    if (!user) {
      throw new Error('Пользователь не найден')
    }

    return await user.getTaskRatings()
  }

  // получить оценку пользователя по конкретному заданию
  async getOneForUser(userId, taskId) {
    if (!taskId) {
      throw new Error('Не задан ID задания')
    }

    if (!userId) {
      throw new Error('Не задан ID пользователя')
    }

    const user = await User.findOne({ where: { id: userId } })
    if (!user) {
      throw new Error('Пользователь не найден')
    }

    const task = await Task.findOne({ where: { id: taskId } })
    if (!task) {
      throw new Error('Задание не найдено')
    }

    return await TaskRating.findOne({
      where: { userId, taskId },
    })
  }
}

module.exports = new TaskRatingService()
