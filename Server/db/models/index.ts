import Marker from './markerModel'
import Dictionary from './dictionaryModel'
import Task from './taskModel'
import UserRole from './userRoleModel'
import User from './userModel'
import Token from './tokenModel'
import TaskRating from './taskRatingModel'

//Определяем связи
Task.hasMany(Marker, { as: 'Markers', foreignKey: 'taskId' }) //у одной задачи может быть множество маркеров
Marker.belongsTo(Task) //каждый маркер приндадлежит какой-то одной задаче

Dictionary.hasMany(Marker, { as: 'Markers', foreignKey: 'dictionaryId' })
Marker.belongsTo(Dictionary)

UserRole.hasMany(User, { as: 'Users', foreignKey: 'userRoleId' })
User.belongsTo(UserRole)

User.hasMany(Token, { as: 'Tokens', foreignKey: 'userId' })
Token.belongsTo(User)

User.belongsToMany(Task, { as: 'TasksWithRating', through: TaskRating })
Task.belongsToMany(User, { as: 'UsersWithRating', through: TaskRating })

User.hasMany(TaskRating)
TaskRating.belongsTo(User)

Task.hasMany(TaskRating)
TaskRating.belongsTo(Task)

export { Marker, Dictionary, Task, UserRole, User, Token, TaskRating }
