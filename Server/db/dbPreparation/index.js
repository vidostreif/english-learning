const { UserRole, TaskRating, User, Task } = require('../models')

//функция предварительного заполнения БД
module.exports = async function dbPreparation(params) {
  await UserRole.findOrCreate({ where: { name: 'user' } })
  await UserRole.findOrCreate({ where: { name: 'administrator' } })

  //!!! Убрать
  //проставляем от имени администратора всем заданиям пятерки
  const user = await User.findOne({
    where: { email: process.env.DB_ADMINISTRATOR_EMAIL },
  })
  const tasks = await Task.findAll()

  tasks.forEach(async (task) => {
    await user.addRatingForTask(task, { through: { rating: 100 } })
  })
}
