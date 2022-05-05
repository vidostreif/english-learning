const { sequelize } = require('..')
const { DataTypes, Model } = require('sequelize')
const Dictionary = require('./dictionaryModel')

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
    modelName: 'task',
    scopes: {
      includeMarkers() {
        return {
          include: [
            {
              association: 'Markers',
              include: Dictionary,
            },
          ],
        }
      },
    },
  }
)

module.exports = Task
