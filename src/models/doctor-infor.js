'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Doctor_Infor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Doctor_Infor.belongsTo(models.User, {foreignKey: 'doctorId'})
      Doctor_Infor.belongsTo(models.Price,{foreignKey: 'priceId'})
      Doctor_Infor.belongsTo(models.Payment,{foreignKey: 'paymentId'})
      Doctor_Infor.belongsTo(models.Province,{foreignKey: 'provinceId'})
      Doctor_Infor.belongsTo(models.Speciality,{foreignKey: 'specialityId'})
      Doctor_Infor.belongsTo(models.Clinic,{foreignKey: 'clinicId'})
      Doctor_Infor.belongsTo(models.User,{foreignKey:'staffId',targetKey:'id',as:'staffData'})
    }
  };
  Doctor_Infor.init({
    doctorId: DataTypes.INTEGER,
    specialityId: DataTypes.INTEGER,
    staffId: DataTypes.INTEGER,
    clinicId: DataTypes.INTEGER,
    priceId: DataTypes.INTEGER,
    provinceId: DataTypes.INTEGER,
    paymentId: DataTypes.INTEGER,
    contentHTML: DataTypes.TEXT('long'),
    contentMarkdown: DataTypes.TEXT('long'),
    description: DataTypes.TEXT('long'),
    note: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Doctor_Infor',
  });
  return Doctor_Infor;
};