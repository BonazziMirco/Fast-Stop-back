'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('users',
            [
                {
                    email: 'user@mail.com',
                    password: await bcrypt.hash("password", 10),
                    authority: 0,
                    car_plate: "C4RPL473",
                    is_active: true
                },
                {
                    email: 'viewer@mail.com',
                    password: await bcrypt.hash("password", 10),
                    authority: 1,
                    is_active: true
                },
                {
                    email: 'operator@mail.com',
                    password: await bcrypt.hash("password", 10),
                    authority: 2,
                    is_active: true
                },
                {
                    email: 'admin@mail.com',
                    password: await bcrypt.hash("password", 10),
                    authority: 3,
                    is_active: true
                },
                {
                    email: 'blocked@mail.com',
                    password: await bcrypt.hash("password", 10),
                    authority: 0,
                    is_active: false
                }
            ]
        );

        await queryInterface.bulkInsert('parking_lots',
            [
                {
                    id: 'SS',
                    name: 'San Severino',
                    address: 'Via Roberto da Sanseverino, 38121 Trento TN',
                    zone_id: 'Zona_Albere',
                    capacity: 150,
                    available_spots: 150,
                    is_active: true
                },
                {
                    id: 'AA',
                    name: 'Via Giovanni Prati',
                    address: 'Via Giovanni Prati, 38122 Trento TN',
                    zone_id: 'Centro_Storico',
                    capacity: 10,
                    available_spots: 10,
                    is_active: true
                },
                {
                    id: 'ST',
                    name: 'Stazione',
                    address: 'Piazza Dante, 38122 Trento TN',
                    zone_id: 'Centro_Storico',
                    capacity: 200,
                    available_spots: 200,
                    is_active: false
                },
                {
                    id: 'PB',
                    name: 'Parcheggio Bruno',
                    address: 'Lungadige S. Nicolò, 38121 Trento TN',
                    zone_id: 'Zona_Piedicastello',
                    capacity: 300,
                    available_spots: 300,
                    is_active: true
                }
            ]
        );

        await queryInterface.bulkInsert('devices',
            [
                {
                    name: 'cam-S_Sev-5',
                    parking_lot_id: 'SS',
                    authority: 1,
                    api_key: 'qwertyuiopasdfghjklzxcvbnm7894561230...'
                },
                {
                    name: 'bar-ST-1',
                    parking_lot_id: 'ST',
                    authority: 0,
                    api_key: '0123456789mnbvcxzlkjhgfdsapoiuytrewq...'
                },
                {
                    name: 'info-P_Duomo-3',
                    parking_lot_id: null,
                    authority: 2,
                    api_key: '1qaz2wsx3edc4rfv5tgb6yhn7ujm8ik9ol0p...'
                },
                {
                    name: 'par-V_Giov_Prati-2',
                    parking_lot_id: 'AA',
                    authority: 0,
                    api_key: 'abcdefghijklmnopqrstuvWxyz0123456789...'
                }
            ]
        );

        await queryInterface.bulkInsert('parking_spots',
            [
                {
                    parking_lot_id: 'AA',
                    spot_number: 1
                },
                {
                    parking_lot_id: 'AA',
                    spot_number: 2
                },
                {
                    parking_lot_id: 'AA',
                    spot_number: 3
                }
            ]
        );

    },

    async down(queryInterface, Sequelize) {
        const Op = Sequelize.Op;

        // remove parking spots first (FKs)
        await queryInterface.bulkDelete('parking_spots', {
            parking_lot_id: 'AA',
            spot_number: { [Op.in]: [1, 2, 3] }
        }, {});

        // remove devices that were inserted
        await queryInterface.bulkDelete('devices', {
            name: { [Op.in]: [
                'cam-S_Sev-5','bar-ST-1','info-P_Duomo-3','par-V_Giov_Prati-2'
            ] }
        }, {});

        // remove parking lots
        await queryInterface.bulkDelete('parking_lots', {
            id: { [Op.in]: ['SS', 'AA', 'ST', 'PB'] }
        }, {});

        // remove users
        await queryInterface.bulkDelete('users', {
            email: { [Op.in]: ['user@mail.com', 'viewer@mail.com', 'operator@mail.com', 'admin@mail.com'] }
        }, {});

    }
};

