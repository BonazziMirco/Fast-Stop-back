'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        email: {
            type: Sequelize.STRING(50),
        },
        password: {
            type: Sequelize.STRING(10),
        },
        authority: {
            type: Sequelize.SMALLINT,
            allowNull: false
        },
        car_plate: {
             type: Sequelize.STRING(60),
             allowNull: true

        },
        is_active: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        created_at: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('NOW()')
        },
        updated_at: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('NOW()')
        }
    });

    await queryInterface.addIndex('users', ['email'], {
        unique: true,
        name: 'idx_email'
    });

    await queryInterface.addIndex('users', ['car_plate'], {
        name: 'idx_carPlate'
    });

    // Create trigger to auto-update updated_at on row updates (PostgreSQL)
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
      CREATE TRIGGER update_users_updated_at
      BEFORE UPDATE ON users
      FOR EACH ROW
      EXECUTE PROCEDURE update_updated_at_column();
    `);
  },

  async down (queryInterface, Sequelize) {
    // Remove trigger first, then drop the table (shared function kept)
    await queryInterface.sequelize.query('DROP TRIGGER IF EXISTS update_users_updated_at ON users;');

    await queryInterface.dropTable('users');
  }
};
