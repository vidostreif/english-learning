import { sequelize } from '..'
import { DataTypes, Model } from 'sequelize'
import Dictionary from './dictionaryModel'
import TaskRating from './taskRatingModel'
import User from './userModel'

class Task extends Model {}

Task.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    imgUrl: { type: DataTypes.STRING, allowNull: false },
    numberOfPasses: { type: DataTypes.INTEGER, defaultValue: 0 },
    complexity: { type: DataTypes.INTEGER, defaultValue: 0 }, //оценка сложности задания
  },
  {
    // underscored: true,
    sequelize,
    // tableName: 'task',
    paranoid: true,
    modelName: 'task',
    scopes: {
      includeMarkers() {
        return {
          include: [
            {
              association: 'Markers',
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
