'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Clinic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Clinic.hasMany(models.Doctor_Infor,{foreignKey: 'clinicId'})
    }
  };
  Clinic.init({
    name: DataTypes.STRING,
    image: DataTypes.BLOB('long'),
    descriptionHTML: DataTypes.TEXT,
    descriptionMarkdown: DataTypes.TEXT,
    address: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Clinic',
  });
  return Clinic;
};