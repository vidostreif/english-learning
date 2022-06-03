import { sequelize } from '..'
import { DataTypes, Model } from 'sequelize'

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

export default Token
