const { sequelize } = require('../db')
const { DataTypes, Model } = require('Sequelize')

// const Marker = sequelize.define('marker', {
//   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//   top: { type: DataTypes.SMALLINT, allowNull: false }, //!!!Нужно прописать диапазаон разрешенных значений
//   left: { type: DataTypes.SMALLINT, allowNull: false },
// })

class Marker extends Model {}

Marker.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    top: { type: DataTypes.SMALLINT, allowNull: false }, //!!!Нужно прописать диапазаон разрешенных значений
    left: { type: DataTypes.SMALLINT, allowNull: false },
  },
  {
    // underscored: true,
    sequelize,
    // tableName: 'marker',
    modelName: 'marker',
  }
)

module.exports = Marker
