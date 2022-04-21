const { sequelize } = require('..')
const { DataTypes, Model } = require('sequelize')

class UserRole extends Model {}

UserRole.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
  },
  {
    // underscored: true,
    sequelize,
    // tableName: 'userRole',
    modelName: 'userRole',
  }
)

module.exports = UserRole
