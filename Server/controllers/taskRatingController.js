const { TaskRating } = require('../db/models')
const ApiError = require('../exceptions/ApiError')

class TaskRatingController {
  //добавление оценки задания от пользователя
  async addUserTaskRating(req, res) {
    console.log(req.user)
    console.log(req.body)
    // const { name } = req.body

    // await TaskRating.create({ userId: 28, taskId: 1, rating: 30 })

    // const user0 = await User.findOne({ where: { id: 28 } })
    // const task0 = await Task.findOne({ where: { id: 1 } })
    // await user0.addTaskRating(task0, { through: { rating: 30 } })
    // await user0.removeTaskRating(task0)

    return res.json({ message: 'Нужно реализовать TaskRatingController!' })
  }

  // удаление оценки пользователя
  async removeUserTaskRating(req, res) {
    console.log(req.query)
    // const { name } = req.body
    // await user0.removeTaskRating(task0)
    res.json({ message: 'Нужно реализовать TaskRatingController!' })
  }

  // получить все оценки пользователя
  async getAllUserTaskRatings(req, res) {
    console.log(req.body)
    // const ratings = await TaskRating.findAll()
    return res.json({ message: 'Нужно реализовать TaskRatingController!' })
  }

  // получить оценку конкретного задания
  async getOneUserTaskRating(req, res) {
    console.log(req.body)
    // const { name } = req.query
    // if (!name) {
    //   next(ApiError.badRequest('Не задан Name'))
    // }
    // const resu = await Dictionary.findOne({
    //   where: { name: name },
    // })
    res.json({ message: 'Нужно реализовать TaskRatingController!' })
  }
}

module.exports = new TaskRatingController()
