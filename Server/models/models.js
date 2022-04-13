const Marker = require('./markerModel')
const Dictionary = require('./dictionaryModel')
const Task = require('./taskModel')

//Определяем связи
Task.hasMany(Marker, { as: 'Markers', foreignKey: 'taskId' }) //у одной задачи может быть множество маркеров
Marker.belongsTo(Task) //каждый маркер приндадлежит какой-то одной задаче

Dictionary.hasMany(Marker, { as: 'Markers', foreignKey: 'dictionaryId' })
Marker.belongsTo(Dictionary)

module.exports = {
  Marker,
  Dictionary,
  Task,
}
