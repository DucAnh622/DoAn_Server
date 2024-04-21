'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Time extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Time.hasMany(models.Schedule,{foreignKey: 'timeId'})
      Time.hasMany(models.Booking,{foreignKey: 'timeId'})
    }
  };
  Time.init({
    timeType: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Time',
  });
  return Time;
};