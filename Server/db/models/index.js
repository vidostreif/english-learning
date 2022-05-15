const Marker = require('./markerModel')
const Dictionary = require('./dictionaryModel')
const Task = require('./taskModel')
const UserRole = require('./userRoleModel')
const User = require('./userModel')
const Token = require('./tokenModel')
const TaskRating = require('./taskRatingModel')

//Определяем связи
Task.hasMany(Marker, { as: 'Markers', foreignKey: 'taskId' }) //у одной задачи может быть множество маркеров
Marker.belongsTo(Task) //каждый маркер приндадлежит какой-то одной задаче

Dictionary.hasMany(Marker, { as: 'Markers', foreignKey: 'dictionaryId' })
Marker.belongsTo(Dictionary)

UserRole.hasMany(User, { as: 'Users', foreignKey: 'userRoleId' })
User.belongsTo(UserRole)

User.hasMany(Token, { as: 'Tokens', foreignKey: 'userId' })
Token.belongsTo(User)

User.belongsToMany(Task, { as: 'RatingForTasks', through: TaskRating })
Task.belongsToMany(User, { as: 'RatingFromUsers', through: TaskRating })

User.hasMany(TaskRating)
TaskRating.belongsTo(User)

Task.hasMany(TaskRating)
TaskRating.belongsTo(Task)

module.exports = {
  Marker,
  Dictionary,
  Task,
  UserRole,
  User,
  Token,
  TaskRating,
}
