'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {

  async up (queryInterface, Sequelize) {

    await queryInterface.sequelize.query(
        'CREATE EXTENSION IF NOT EXISTS pg_partman'
    );

    // Create table AS PARTITIONED from the start using raw SQL
    await queryInterface.sequelize.query(`
      CREATE TABLE reservations (
                                  id SERIAL,
                                  parking_lot_id CHAR(2) NOT NULL,
                                  spot_number SMALLINT NOT NULL,
                                  car_plate VARCHAR NOT NULL,
                                  length INTEGER NOT NULL,
                                  freed BOOLEAN NOT NULL DEFAULT false,
                                  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                  PRIMARY KEY (id, created_at)
      ) PARTITION BY RANGE (created_at);
    `);

    // Add indexes
    await queryInterface.sequelize.query(`
      CREATE INDEX idx_parking_lot_id 
      ON reservations (parking_lot_id);
    `);

    await queryInterface.sequelize.query(`
      CREATE INDEX idx_car_plate 
      ON reservations (car_plate);
    `);

    // Configure auto-partitioning
    await queryInterface.sequelize.query(`
      SELECT create_parent(
       'public.reservations',
       'created_at',
       '1 month',
       'range'
      );
    `);

    // Schedule maintenance
    await queryInterface.sequelize.query(`
      UPDATE part_config
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