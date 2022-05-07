const { sequelize } = require('..')
const { DataTypes, Model } = require('sequelize')
const Task = require('./taskModel')
const User = require('./userModel')

class TaskRating extends Model {}

TaskRating.init(
  {
    // id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    // taskId: {
    //   type: DataTypes.INTEGER,
    //   references: {
    //     model: Task, // или 'Tasks'

    //     key: 'id',
    //   },
    //   onDelete: 'CASCADE',
    //   onUpdate: 'CASCADE',
    //   allowNull: false,
    //   unique: true,
    // },
    // userId: {
    //   type: DataTypes.INTEGER,
    //   references: {
    //     model: User, // или 'Users'

    //     key: 'id',
    //   },
    //   onDelete: 'CASCADE',
    //   onUpdate: 'CASCADE',
    //   allowNull: false,
    //   unique: true,
    // },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 0, max: 100 },
    }, //оценка от пользователя
  },
  {
    // underscored: true,
    sequelize,
    // tableName: 'task',
    modelName: 'taskRating',
  }
)

module.exports = TaskRating
