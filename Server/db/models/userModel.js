const { sequelize } = require('..')
const { DataTypes, Model } = require('sequelize')
const UserRole = require('./userRoleModel')

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
    scopes: {
      role: {
        include: [
          {
            model: UserRole,
            // where: { active: true },
          },
        ],
      },
    },
  }
)

module.exports = User
