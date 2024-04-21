'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Booking', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      doctorId: {
        type: Sequelize.INTEGER
      },
      patientId: {
        type: Sequelize.INTEGER
      },
      staffId: {
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.STRING
      },
      statusId: {
        type: Sequelize.INTEGER
      },
      timeId: {
        type: Sequelize.INTEGER
      },
      patientName: {
        type: Sequelize.STRING
      },
      patientGenderId: {
        type: Sequelize.INTEGER
      },
      reason: {
        type: Sequelize.STRING
      },
      comment: {
        type: Sequelize.STRING
      },
      cancel: {
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
    await queryInterface.dropTable('Booking');
  }
};