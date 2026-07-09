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

    /**
     * FUNZIONE TOLTA PER LIMITI ESTERNI DI DEPLOYABILITY
     */

    /*
    // Configure auto-partitioning
    // Create parent only if not already configured to avoid duplicate key errors
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM part_config WHERE parent_table = 'public.reservations') THEN
          PERFORM create_parent('public.reservations', 'created_at', '1 month', 'range');
        END IF;
      END
      $$;
    `);

    // Schedule maintenance
    await queryInterface.sequelize.query(`
      UPDATE part_config
      SET retention = '13 months',
          retention_keep_table = false,
          premake = 3
      WHERE parent_table = 'public.reservations';
    `);

    // Create trigger function to auto-update updated_at (PostgreSQL)
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER update_reservations_updated_at
      BEFORE UPDATE ON reservations
      FOR EACH ROW
      EXECUTE PROCEDURE update_updated_at_column();
    `);

     */
  },

  async down (queryInterface, Sequelize) {
    // Remove trigger before dropping table (shared function kept)
    await queryInterface.sequelize.query('DROP TRIGGER IF EXISTS update_reservations_updated_at ON reservations;');

    await queryInterface.dropTable('reservations');
  }
};