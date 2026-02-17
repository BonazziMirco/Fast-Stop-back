'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('devices', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true
      },
      parking_lot_id: {
        type: Sequelize.CHAR(2),
        allowNull: false,
        references: {
          model: 'parking_lots',
          key: 'id'
        },
        onDelete: 'SET NULL'
      },
      authority: {
        type: Sequelize.SMALLINT,
        allowNull: false
      },
      last_heartbeat: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      api_key: {
        type: Sequelize.STRING(60),
        allowNull: false,
      }
    })

    await queryInterface.addIndex('devices', ['parking_lot_id'], {
      name: 'idx_parking_lot_id'
    });

    await queryInterface.addIndex('devices', ['name'], {
      unique: true,
      name: 'idx_name'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('devices');
  }
};
