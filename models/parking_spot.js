const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const ParkingLot = require("./parking_lot");

class ParkingSpot extends Model {}

ParkingSpot.init({
    parking_lot_id: {
        type: DataTypes.CHAR(2),
        allowNull: false,
        references: {
            model: 'parking_lots',
            key: 'id'
        }
    },
    spot_number: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        validate: {
            min: 0
        }
    }
}, {
    sequelize,
    modelName: 'ParkingSpot',
    tableName: 'parking_spots',
    timestamps: false
});

ParkingSpot.belongsTo(ParkingLot, {
    foreignKey: 'parking_lot_id',
    targetKey: 'id',
    onDelete: 'CASCADE'
});

ParkingLot.hasMany(ParkingSpot, {
    foreignKey: 'parking_lot_id'
});

module.exports = ParkingSpot;