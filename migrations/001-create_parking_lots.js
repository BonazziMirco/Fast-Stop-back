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
        defaultValue: Sequelize.literal('NOW()')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()')
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
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
      CREATE TRIGGER update_parking_lots_updated_at
      BEFORE UPDATE ON parking_lots
      FOR EACH ROW
      EXECUTE PROCEDURE update_updated_at_column();
    `);
  },

  async down (queryInterface, Sequelize) {
    // Remove trigger then drop table (shared function kept)
    await queryInterface.sequelize.query('DROP TRIGGER IF EXISTS update_parking_lots_updated_at ON parking_lots;');

    await queryInterface.dropTable('parking_lots');
  }
};
