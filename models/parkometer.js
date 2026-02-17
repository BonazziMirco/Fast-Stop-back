const { DataTypes, Model } = require('sequelize');
const ParkingLot = require('./parking_lot');
const sequelize = require('../config/database');

class Parkometer extends Model {

    async updateHeartBeat(id) {
        await this.update(
            { last_heartbeat: new Date() },
            { where: { id } }
        );
    }
}

Parkometer.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    parking_lot_id: {
        type: DataTypes.CHAR(2),
        allowNull: false,
        references: {
            model: 'parking_lots',
            key: 'id'
        }
    },
    last_heartbeat: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    modelName: 'Parkometer',
    tableName: 'parkometers',
    timestamps: false,
    indexes: [
        { fields: ['parking_lot_id'] }
    ]
});

Parkometer.belongsTo(ParkingLot, {
    foreignKey: 'parking_lot_id',
    targetKey: 'id',
    onDelete: 'SET NULL'
});

ParkingLot.hasMany(Parkometer, {
    foreignKey: 'parking_lot_id'
})

module.exports = Parkometer;