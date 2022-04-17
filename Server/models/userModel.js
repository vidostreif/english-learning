const { sequelize } = require('../db')
const { DataTypes, Model } = require('sequelize')

class User extends Model {}

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
  },
  {
    // underscored: true,
    sequelize,
    // tableName: 'user',
    modelName: 'user',
  }
)

module.exports = User
