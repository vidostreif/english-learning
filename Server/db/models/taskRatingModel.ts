import { sequelize } from '..'
import { DataTypes, Model } from 'sequelize'
import Task from './taskModel'
import User from './userModel'

class TaskRating extends Model {}

TaskRating.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 0, max: 100 },
    }, //оценка от пользователя
    taskId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    // underscored: true,
    sequelize,
    // tableName: 'task',
    modelName: 'taskRating',
    timestamps: false,
  }
)

// const TaskRating = sequelize.define(
//   'taskRating',
//   {
//     // id: {
//     //   type: DataTypes.INTEGER,
//     //   primaryKey: true,
//     //   autoIncrement: true,
//     //   allowNull: false,
//     // },
//     rating: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       validate: { min: 0, max: 100 },
//     }, //оценка от пользователя
//     taskId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       primaryKey: true,
//     },
//     userId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       primaryKey: true,
//     },
//   },
//   { timestamps: false }
// )

export default TaskRating
