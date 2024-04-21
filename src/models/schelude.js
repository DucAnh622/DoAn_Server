'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Schedule.belongsTo(models.Time,{foreignKey: 'timeId'})
      Schedule.belongsTo(models.User,{foreignKey: 'doctorId',targetKey: 'id', as: 'doctorData'})
    }
  };
  Schedule.init({
    date: DataTypes.STRING,
    timeId: DataTypes.INTEGER,
    doctorId: DataTypes.INTEGER,
    check: {
      type: DataTypes.BOOLEAN,
      defaultValue: false 
    }
  }, {
    sequelize,
    modelName: 'Schedule',
  });
  return Schedule;
};