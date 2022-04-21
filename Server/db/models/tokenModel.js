const { sequelize } = require('..')
const { DataTypes, Model } = require('sequelize')

class Token extends Model {}

Token.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    refreshToken: { type: DataTypes.STRING, unique: false, allowNull: false },
  },
  {
    // underscored: true,
    sequelize,
    // tableName: 'token',
    modelName: 'token',
  }
)

module.exports = Token
