import { User, Task, TaskRating } from '../db/models'

class TaskRatingService {
  //добавление новой оценки
  async add(userId: number, taskId: number, rating: number): Promise<number> {
    const user = await User.findOne({ where: { id: userId } })
    if (!user) {
      throw new Error('Пользователь не найден')
    }

    const task = await Task.findOne({ where: { id: taskId } })
    if (!task) {
      throw new Error('Задание не найдено')
    }

    await this.remove(userId, taskId)
    await user.addTasksWithRating([task], { through: { rating: rating } })

    return rating
  }

  // удаление оценки
  async remove(userId: number, taskId: number): Promise<void> {
    const user = await User.findOne({ where: { id: userId } })
    if (!user) {
      throw new Error('Пользователь не найден')
    }

    const task = await Task.findOne({ where: { id: taskId } })
    if (!task) {
      throw new Error('Задание не найдено')
    }

    return await user.removeTasksWithRating(task)
  }

  // получить все оценки пользователя
  async getAllForUser(userId: number): Promise<Array<TaskRating>> {
    const user = await User.findOne({ where: { id: userId } })

    if (!user) {
      throw new Error('Пользователь не найден')
    }

    return await user.getTaskRatings()
  }

  // получить оценку пользователя по конкретному заданию
  async getOneForUser(userId: number, taskId: number): Promise<TaskRating> {
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

export default new TaskRatingService()
