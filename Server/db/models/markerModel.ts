import { sequelize } from '..'
import * as Sequelize from 'sequelize'

import {
  Association,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManySetAssociationsMixin,
  HasManyAddAssociationsMixin,
  HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  BelongsToManyAddAssociationsMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToCreateAssociationMixin,
  Model,
  ModelDefined,
  Optional,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  ForeignKey,
} from 'sequelize'
import Task from './taskModel'
import Dictionary from './dictionaryModel'

class Marker extends Model<InferAttributes<Marker>, InferCreationAttributes<Marker>> {
  declare id: CreationOptional<number>
  declare top: number
  declare left: number

  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>

  declare taskId: ForeignKey<Task['id']>
  declare task?: NonAttribute<Task>
  declare getTask: BelongsToGetAssociationMixin<Task>
  declare setTask: BelongsToSetAssociationMixin<Task, number>
  declare createTask: BelongsToCreateAssociationMixin<Task>

  declare dictionaryId: ForeignKey<Dictionary['id']>
  declare dictionary?: NonAttribute<Dictionary>
  declare getDictionary: BelongsToGetAssociationMixin<Dictionary>
  declare setDictionary: BelongsToSetAssociationMixin<Dictionary, number>
  declare createDictionary: BelongsToCreateAssociationMixin<Dictionary>
}

Marker.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    top: { type: DataTypes.SMALLINT, allowNull: false }, //!!!Нужно прописать диапазаон разрешенных значений
    left: { type: DataTypes.SMALLINT, allowNull: false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    // underscored: true,
    sequelize,
    // tableName: 'marker',
    modelName: 'marker',
  }
)

export default Marker
