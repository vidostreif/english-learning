const { sequelize } = require('../db')
const { DataTypes, Model } = require('Sequelize')
// const Marker = require('./markerModel')
const Dictionary = require('./dictionaryModel')

class Task extends Model {}

Task.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    imgUrl: { type: DataTypes.STRING, allowNull: false },
    numberOfPasses: { type: DataTypes.INTEGER, defaultValue: 0 },
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

// const Task = sequelize.define('task', {
//   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//   imgUrl: { type: DataTypes.STRING, allowNull: false },
//   numberOfPasses: { type: DataTypes.INTEGER, defaultValue: 0 },
// })

module.exports = Task
