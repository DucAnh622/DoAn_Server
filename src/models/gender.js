'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Gender extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Gender.hasMany(models.User,{foreignKey: 'genderId'})
      Gender.hasMany(models.Booking,{foreignKey: 'patientGenderId'})
    }
  };
  Gender.init({
    valueEN: DataTypes.STRING,
    valueVI: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Gender',
  });
  return Gender;
};