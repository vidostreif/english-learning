import { sequelize } from '..'
import Dictionary from './dictionaryModel'
import TaskRating from './taskRatingModel'
import User from './userModel'
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
  Model,
  ModelDefined,
  Optional,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  ForeignKey,
} from 'sequelize'
import Marker from './markerModel'

class Task extends Model<InferAttributes<Task>, InferCreationAttributes<Task>> {
  declare id: CreationOptional<number>
  declare imgUrl: string
  declare numberOfPasses: number
  declare complexity: number

  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>
  // deletedAt can be undefined during creation
  // declare deletedAt: CreationOptional<Date>

  declare markers?: NonAttribute<Array<Marker>>
  declare getMarkers: HasManyGetAssociationsMixin<Marker> // Note the null assertions!
  declare addMarker: HasManyAddAssociationMixin<Marker, number>
  declare addMarkers: HasManyAddAssociationsMixin<Marker, number>
  declare setMarkers: HasManySetAssociationsMixin<Marker, number>
  declare removeMarker: HasManyRemoveAssociationMixin<Marker, number>
  declare removeMarkers: HasManyRemoveAssociationsMixin<Marker, number>
  declare hasMarker: HasManyHasAssociationMixin<Marker, number>
  declare hasMarkers: HasManyHasAssociationsMixin<Marker, number>
  declare countMarkers: HasManyCountAssociationsMixin
  declare createMarker: HasManyCreateAssociationMixin<Marker, 'taskId'>

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
  declare creatTaskRatingn: HasManyCreateAssociationMixin<TaskRating, 'taskId'>

  declare UsersWithRatings?: NonAttribute<Array<User>>
  declare addUsersWithRating: BelongsToManyAddAssociationsMixin<User, number>
  declare removeUsersWithRating: BelongsToManyRemoveAssociationMixin<User, number>
  declare getUsersWithRatings: BelongsToManyGetAssociationsMixin<User>
}

Task.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    imgUrl: { type: DataTypes.STRING, allowNull: false },
    numberOfPasses: { type: DataTypes.INTEGER, defaultValue: 0 },
    complexity: { type: DataTypes.INTEGER, defaultValue: 0 }, //оценка сложности задания
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    // deletedAt: DataTypes.DATE,
  },
  {
    // underscored: true,
    sequelize,
    // tableName: 'task',
    // paranoid: true,
    modelName: 'task',
    scopes: {
      includeMarkers() {
        return {
          include: [
            {
              association: 'markers',
              include: [Dictionary],
            },
          ],
        }
      },
      includeRating() {
        return {
          attributes: {
            include: [[sequelize.fn('AVG', sequelize.col('taskRatings.rating')), 'rating']],
          },
          include: [
            {
              model: TaskRating,
              attributes: [],
            },
          ],
          group: ['task.id'],
          subQuery: false, // отключение создания подзапроса, что бы работал limit
        }
      },
    },
  }
)

export default Task
