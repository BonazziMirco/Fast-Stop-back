'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('parking_lots', {
      id: {
        type: Sequelize.CHAR(2),
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      address: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      zone_id: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      capacity: {
        type: Sequelize.SMALLINT,
        allowNull: false
      },
      available_spots: {
        type: Sequelize.SMALLINT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add indexes
    await queryInterface.addIndex('parking_lots', ['zone_id'], {
      name: 'idx_parking_lots_zone_id'
    });

    await queryInterface.addIndex('parking_lots', ['available_spots'], {
      name: 'idx_parking_lots_available_spots'
    });


    // Add CHECK constraint for capacity range
    await queryInterface.sequelize.query(`
    ALTER TABLE parking_lots 
    ADD CONSTRAINT chk_parking_lots_capacity 
    CHECK (capacity >= 1 AND capacity <= 1000)
  `);

    // Add CHECK constraint for available_spots <= capacity
    await queryInterface.sequelize.query(`
    ALTER TABLE parking_lots 
    ADD CONSTRAINT chk_parking_lots_available 
    CHECK (available_spots <= capacity)
  `);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('parking_lots');
  }
};
