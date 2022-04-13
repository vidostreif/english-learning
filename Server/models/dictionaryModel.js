const { sequelize } = require('../db')
const { DataTypes, Model } = require('sequelize')

// const Dictionary = sequelize.define('dictionary', {
//   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//   name: { type: DataTypes.STRING, unique: true, allowNull: false },
// })

class Dictionary extends Model {}

Dictionary.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
  },
  {
    // underscored: true,
    sequelize,
    // tableName: 'dictionary',
    modelName: 'dictionary',
  }
)

module.exports = Dictionary
