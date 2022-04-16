const { sequelize } = require('../db')
const { DataTypes, Model } = require('sequelize')

class User extends Model {}

User.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: false, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, unique: false, allowNull: false },
  },
  {
    // underscored: true,
    sequelize,
    // tableName: 'user',
    modelName: 'user',
  }
)

module.exports = User
