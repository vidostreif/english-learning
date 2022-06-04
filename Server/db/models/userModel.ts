import { sequelize } from '..'
import UserRole from './userRoleModel'
import Task from './taskModel'
import Token from './tokenModel'
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
import TaskRating from './taskRatingModel'

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>
  declare name: string | null
  declare email: string
  declare password: string
  declare isActivated: boolean
  declare activationLink: string | null

  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>
  // deletedAt can be undefined during creation
  declare deletedAt: CreationOptional<Date>

  declare Tokens?: NonAttribute<Array<Token>>
  declare getTokens: HasManyGetAssociationsMixin<Token> // Note the null assertions!
  declare addToken: HasManyAddAssociationMixin<Token, number>
  declare addTokens: HasManyAddAssociationsMixin<Token, number>
  declare setTokens: HasManySetAssociationsMixin<Token, number>
  declare removeToken: HasManyRemoveAssociationMixin<Token, number>
  declare removeTokens: HasManyRemoveAssociationsMixin<Token, number>
  declare hasToken: HasManyHasAssociationMixin<Token, number>
  declare hasTokens: HasManyHasAssociationsMixin<Token, number>
  declare countTokens: HasManyCountAssociationsMixin
  declare createToken: HasManyCreateAssociationMixin<Token, 'userId'>

  declare TaskRatings?: NonAttribute<Array<TaskRating>>
  declare getTaskRatings: HasManyGetAssociationsMixin<TaskRating> // Note the null assertions!
  declare addTaskRating: HasManyAddAssociationMixin<TaskRating, number>
  declare addTaskRatings: HasManyAddAssociationsMixin<TaskRating, number>
  declare setTaskRatings: HasManySetAssociationsMixin<TaskRating, number>
  declare removeTaskRating: HasManyRemoveAssociationMixin<TaskRating, number>
  declare removeTaskRatings: HasManyRemoveAssociationsMixin<TaskRating, number>
  declare hasTaskRating: HasManyHasAssociationMixin<TaskRating, number>
  declare hasTaskRatings: HasManyHasAssociationsMixin<TaskRating, number>
  declare countTaskRatings: HasManyCountAssociationsMixin
  declare creatTaskRatingn: HasManyCreateAssociationMixin<TaskRating, 'userId'>

  declare TasksWithRatings?: NonAttribute<Array<Task>>
  declare addTasksWithRating: BelongsToManyAddAssociationsMixin<Task, number>
  declare removeTasksWithRating: BelongsToManyRemoveAssociationMixin<Task, number>
  declare getTasksWithRatings: BelongsToManyGetAssociationsMixin<Task>

  declare userRoleId: ForeignKey<UserRole['id']>
  declare userRole?: NonAttribute<UserRole>
  declare getRole: BelongsToGetAssociationMixin<UserRole>
  declare setRole: BelongsToSetAssociationMixin<UserRole, number>
  declare createRole: BelongsToCreateAssociationMixin<UserRole>
}

User.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: false, allowNull: true },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, unique: false, allowNull: false },
    isActivated: {
      type: DataTypes.BOOLEAN,
      unique: false,
      allowNull: false,
      defaultValue: false,
    },
    activationLink: { type: DataTypes.STRING, unique: false, allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    // underscored: true,
    sequelize,
    paranoid: true,
    // tableName: 'user',
    modelName: 'user',
    scopes: {
      role: {
        include: [
          {
            model: UserRole,
            // where: { active: true },
          },
        ],
      },
    },
  }
)

export default User
