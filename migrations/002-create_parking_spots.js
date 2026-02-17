'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('parking_spots', {
        parking_lot_id: {
            type: Sequelize.CHAR(2),
            allowNull: false,
            references: {
            model: 'parking_lots',
            key: 'id'
            },
            onDelete: 'CASCADE'
        },
        spot_number: {
            type: Sequelize.SMALLINT,
            allowNull: false
        }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('parking_spots');
  }
};
