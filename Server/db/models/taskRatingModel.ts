import { sequelize } from '..'
import Task from './taskModel'
import User from './userModel'
import * as Sequelize from 'sequelize'

import {
  Association,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManySetAssociationsMixin,
  HasManyAddAssociationsMixin,
  HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  BelongsToManyAddAssociationsMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToCreateAssociationMixin,
  Model,
  ModelDefined,
  Optional,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  ForeignKey,
} from 'sequelize'

class TaskRating extends Model<InferAttributes<TaskRating>, InferCreationAttributes<TaskRating>> {
  declare id: CreationOptional<number>
  declare rating: number

  declare taskId: ForeignKey<Task['id']>
  declare task?: NonAttribute<Task>
  declare getTask: BelongsToGetAssociationMixin<Task>
  declare setTask: BelongsToSetAssociationMixin<Task, number>
  declare createTask: BelongsToCreateAssociationMixin<Task>

  declare userId: ForeignKey<User['id']>
  declare user?: NonAttribute<User>
  declare getUser: BelongsToGetAssociationMixin<User>
  declare setUser: BelongsToSetAssociationMixin<User, number>
  declare createUser: BelongsToCreateAssociationMixin<User>
}

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
