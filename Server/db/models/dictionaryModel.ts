import { sequelize } from '..'
import { DataTypes, Model } from 'sequelize'

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

export default Dictionary
