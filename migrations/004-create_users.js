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
            type: Sequelize.STRING(60),
        },
        authority: {
            type: Sequelize.SMALLINT,
            allowNull: false
        },
        car_plate: {
             type: Sequelize.STRING(20),
             allowNull: true

        },
        is_active: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        created_at: {
            allowNull: false,
            type: Sequelize.DATE
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE
        }
    });

    await queryInterface.addIndex('users', ['email'], {
        unique: true,
        name: 'idx_email'
    });

    await queryInterface.addIndex('users', ['car_plate'], {
        name: 'idx_carPlate'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
