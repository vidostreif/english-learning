const { UserRole, TaskRating, User, Task } = require('../models')

//функция предварительного заполнения БД
module.exports = async function dbPreparation(params) {
  await UserRole.findOrCreate({ where: { name: 'user' } })
  await UserRole.findOrCreate({ where: { name: 'administrator' } })
}
