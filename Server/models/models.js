const Marker = require('./markerModel')
const Dictionary = require('./dictionaryModel')
const Task = require('./taskModel')
const UserRole = require('./userRoleModel')
const User = require('./userModel')

//Определяем связи
Task.hasMany(Marker, { as: 'Markers', foreignKey: 'taskId' }) //у одной задачи может быть множество маркеров
Marker.belongsTo(Task) //каждый маркер приндадлежит какой-то одной задаче

Dictionary.hasMany(Marker, { as: 'Markers', foreignKey: 'dictionaryId' })
Marker.belongsTo(Dictionary)

UserRole.hasMany(User, { as: 'User', foreignKey: 'userRoleId' })
User.belongsTo(UserRole)

module.exports = {
  Marker,
  Dictionary,
  Task,
  UserRole,
  User,
}
