'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {

  //TODO : implementare partizionamento automatico con pg_partman
  async up (queryInterface, Sequelize) {

    await queryInterface.sequelize.query(
        'CREATE EXTENSION IF NOT EXISTS pg_partman'
    );

    await queryInterface.createTable('reservations', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      parking_lot_id: {
        type: Sequelize.CHAR(2),
        allowNull: false
      },
      spot_number: {
        type: Sequelize.SMALLINT,
        allowNull: false
      },
      car_plate: {
        type: Sequelize.STRING,
        allowNull: false
      },
      length: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      freed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
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

    // Convert to partitioned table
        await queryInterface.sequelize.query(`
      ALTER TABLE reservations 
      PARTITION BY RANGE (created_at);
    `);

    // Add indexes
    await queryInterface.addIndex('reservations', ['parking_lot_id'], {
      name: 'idx_parking_lot_id',
      concurrently: true
    });

    await queryInterface.addIndex('reservations', ['car_plate'], {
      name: 'idx_car_plate',
      concurrently: true
    });



    // Configure auto-partitioning
    await queryInterface.sequelize.query(`
    SELECT partman.create_parent(
      'public.reservations', 
      'created_at', 
      'native', 
      'monthly'
    );
  `);

    // Schedule maintenance
    await queryInterface.sequelize.query(`
      UPDATE partman.part_config 
      SET retention = '13 months',
          retention_keep_table = false,
          premake = 3
      WHERE parent_table = 'public.reservations';
    `);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('reservations');
  }
};
