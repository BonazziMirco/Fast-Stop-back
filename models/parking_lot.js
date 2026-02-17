const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class ParkingLot extends Model {

    async updateCapacity(newCapacity) {
        const delta = newCapacity - this.capacity;
        this.capacity = newCapacity;

        this.availableSpots += delta;

        await this.save();
        return this;
    }

    async freeSpot() {
        const parkingLot = await this.findByPk(id);
        if (!parkingLot) {
            throw new Error('Parking lot not found');
        }
        if (parkingLot.availableSpots >= parkingLot.capacity) {
            throw new Error('All spots are already free');
        }
        parkingLot.availableSpots += 1;
        await parkingLot.save();
        return this;
    }

    static async occupySpot(id) {
        const parkingLot = await this.findByPk(id);
        if (!parkingLot) {
            throw new Error('Parking lot not found');
        }
        if (parkingLot.availableSpots <= 0) {
            throw new Error('No available spots to occupy');
        }
        parkingLot.availableSpots -= 1;
        await parkingLot.save();
    }
}

ParkingLot.init({
    id: {
        type: DataTypes.CHAR(2),
        primaryKey: true,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [1, 2]
        }
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 100]
        }
    },
    address: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [5, 200]
        }
    },
    // TODO: Validate zone with a list of allowed zones
    zoneId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'zone_id',
        validate: {
            notEmpty: true
        }
    },
    capacity: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        validate: {
            min: 1,
            max: 1000
        }
    },
    availableSpots: {
        type: DataTypes.SMALLINT,
        allowNull: true,
        field: 'available_spots',
        validate: {
            customValidator(value) {
                if (value > this.capacity) {
                    throw new Error('availableSpots cannot exceed capacity');
                }
            }
        }
    }
}, {
    sequelize,
    modelName: 'ParkingLot',
    tableName: 'parking_lots',
    underscored: true,
    timestamps: true,
    hooks: {
        beforeSave: (parkingLot) => {
            // Validate available spots
            if (parkingLot.availableSpots > parkingLot.capacity) {
                throw new Error('Available spots cannot exceed capacity');
            }
        }
    },
    indexes: [
        { fields: ['zone_id'] },
        { fields: ['available_spots'] }
    ],
});

module.exports = ParkingLot;