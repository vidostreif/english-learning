import { sequelize } from '..'
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
  Model,
  ModelDefined,
  Optional,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  ForeignKey,
} from 'sequelize'
import Marker from './markerModel'

class Dictionary extends Model<InferAttributes<Dictionary>, InferCreationAttributes<Dictionary>> {
  declare id: CreationOptional<number>
  declare name: string

  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>

  declare Markers?: Array<Marker>
  declare getMarkers: HasManyGetAssociationsMixin<Marker> // Note the null assertions!
  declare addMarker: HasManyAddAssociationMixin<Marker, number>
  declare addMarkers: HasManyAddAssociationsMixin<Marker, number>
  declare setMarkers: HasManySetAssociationsMixin<Marker, number>
  declare removeMarker: HasManyRemoveAssociationMixin<Marker, number>
  declare removeMarkers: HasManyRemoveAssociationsMixin<Marker, number>
  declare hasMarker: HasManyHasAssociationMixin<Marker, number>
  declare hasMarkers: HasManyHasAssociationsMixin<Marker, number>
  declare countMarkers: HasManyCountAssociationsMixin
  declare createMarker: HasManyCreateAssociationMixin<Marker, 'dictionaryId'>
}

Dictionary.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    scopes: {
      includeMarkers() {
        return {
          include: [
            {
              association: 'Markers',
              include: [Dictionary],
            },
          ],
        }
      },
    },
    // underscored: true,
    sequelize,
    // tableName: 'dictionary',
    modelName: 'dictionary',
  }
)

export default Dictionary
