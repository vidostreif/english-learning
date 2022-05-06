const { sequelize } = require('..')
const { DataTypes, Model } = require('sequelize')

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