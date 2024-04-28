'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Booking.belongsTo(models.User,{foreignKey:'patientId',targetKey:'id',as:'patientData'})
      Booking.belongsTo(models.User, { foreignKey: 'doctorId', targetKey: 'id', as: 'doctorDataBooking' });
      Booking.belongsTo(models.User,{foreignKey:'staffId',targetKey:'id',as:'staffDataBooking'})
      Booking.belongsTo(models.Gender,{foreignKey: 'patientGenderId'})
      Booking.belongsTo(models.Status,{foreignKey: 'statusId'})
      Booking.belongsTo(models.Time,{foreignKey: 'timeId'})
    }
  };
  Booking.init({
    statusId: DataTypes.STRING,
    doctorId: DataTypes.INTEGER,
    patientId: DataTypes.INTEGER,
    patientName: DataTypes.STRING,
    patientGenderId: DataTypes.INTEGER,
    staffId: DataTypes.INTEGER,
    date: DataTypes.STRING,
    timeId: DataTypes.INTEGER,
    reason: DataTypes.STRING,
    result: DataTypes.BLOB('long'),
    comment: DataTypes.STRING,
    cancel: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};