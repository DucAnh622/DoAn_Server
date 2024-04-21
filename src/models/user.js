'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Booking, { foreignKey: 'doctorId', as: 'doctorDataBooking' });
      User.hasMany(models.Doctor_Infor, { foreignKey: 'staffId', as: 'staffData' });
      User.hasOne(models.Doctor_Infor, {foreignKey: 'doctorId'})
      User.hasMany(models.Schedule,{foreignKey: 'doctorId', as: 'doctorData'})
      User.hasMany(models.Booking,{foreignKey: 'patientId', as: 'patientData'})
      User.hasMany(models.Booking,{foreignKey: 'staffId', as: 'staffDataBooking'})
      User.belongsTo(models.Role,{foreignKey: 'roleId'})
      User.belongsTo(models.Gender,{foreignKey: 'genderId'})
      User.belongsTo(models.Position,{foreignKey: 'positionId'})
    }
  };
  User.init({
    fullName: DataTypes.STRING,
    image: DataTypes.BLOB('long'),
    genderId: DataTypes.INTEGER,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    address: DataTypes.STRING,
    phone: DataTypes.STRING,
    roleId: DataTypes.INTEGER,
    positionId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};