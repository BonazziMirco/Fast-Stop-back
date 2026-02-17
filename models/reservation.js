const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Reservation extends Model {
    // TODO could change all of these to queries to take advantage of partitioning (active or not)
        static async findByCarPlate(carPlate) {
            return this.findAll({ where: { car_plate: carPlate } });
        }

        static async findActiveByCarPlate(carPlate) {
            return this.findOne({ where: { car_plate: carPlate, freed: false } });
        }

        async freeSpot(id) {
            const reservation = await this.findByPk(id);
            if (!reservation) {
                throw new Error('Reservation not found');
            }
            if (reservation.freed) {
                throw new Error('Spot is already freed');
            }
            reservation.freed = true;
            await reservation.save();
        }
}

Reservation.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    parking_lot_id: {
        type: DataTypes.CHAR(2),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [1, 2]
        }
    },
    spot_number: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        validate: {
            min: 0
        }
    },
    car_plate: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    length: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    },
    freed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize,
    modelName: 'reservation',
    tableName: 'Reservation',
    timestamps: false,
    indexes: [
        { fields: ['parking_lot_id'] },
        { fields: ['car_plate'] }
    ]
});

module.exports = Reservation;