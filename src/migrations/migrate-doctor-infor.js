'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Doctor_Infor', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      doctorId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      staffId: {
        type: Sequelize.INTEGER,
      },
      specialityId: {
        type: Sequelize.INTEGER,
      },
      clinicId: {
        type: Sequelize.INTEGER,
      },
      priceId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      provinceId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      paymentId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      contentHTML: {
        type: Sequelize.TEXT('long'),
        allowNull: false
      },
      contentMarkdown: {
        type: Sequelize.TEXT('long'),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT('long'),
        allowNull: true
      },
      note: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Doctor_Infor');
  }
};