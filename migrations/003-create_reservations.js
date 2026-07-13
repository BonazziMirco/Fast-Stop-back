'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Enable pg_partman
    await queryInterface.sequelize.query(
        'CREATE EXTENSION IF NOT EXISTS pg_partman'
    );

    // Create parent table
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
      CREATE INDEX idx_parking_lot_id ON reservations (parking_lot_id);
      CREATE INDEX idx_car_plate ON reservations (car_plate);
    `);

    // 🆕 FIRST: Create the initial partition manually
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
    const partitionName = `reservations_${currentYear}_${currentMonth}`;

    const startDate = new Date(currentYear, now.getMonth(), 1);
    const endDate = new Date(currentYear, now.getMonth() + 1, 1);

    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS ${partitionName}
        PARTITION OF reservations
        FOR VALUES FROM ('${startDate.toISOString()}') TO ('${endDate.toISOString()}');
    `);

    // NOW configure pg_partman
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM part_config WHERE parent_table = 'public.reservations') THEN
          PERFORM create_parent('public.reservations', 'created_at', '1 month', 'range');
        END IF;
      END
      $$;
    `);

    // Configure retention and premake
    await queryInterface.sequelize.query(`
      UPDATE part_config
      SET retention = '13 months',
          retention_keep_table = false,
          premake = 3
      WHERE parent_table = 'public.reservations';
    `);

    // NOW run_maintenance() will work because there's at least one partition
    await queryInterface.sequelize.query(`
      SELECT run_maintenance('public.reservations');
    `);

    // Create the update trigger
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
        'DROP TRIGGER IF EXISTS update_reservations_updated_at ON reservations;'
    );
    await queryInterface.dropTable('reservations');
  }
};