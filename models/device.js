const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/database');
const ParkingLot = require('./parking_lot');

class Device extends Model {

    static async hashApiKey(device) {
        if (device.changed('api_key')) {
            const salt = await bcrypt.genSalt(10);
            device.api_key = await bcrypt.hash(device.api_key, salt);
        }
    }

    async checkApiKey(device, apiKey) {
        return bcrypt.compare(apiKey, device.api_key);
    }
}

Device.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
    },
    parking_lot_id: {
        type: DataTypes.CHAR(2),
        allowNull: false,
        references: {
            model: 'parking_lots',
            key: 'id'
        },
        onDelete: 'SET NULL'
    },
    authority: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        validate: {
            min: 0,         //  non gerarchica
            max: 2          //  future proofing: parchimetro, conteggiatore per parcheggi liberi e view only per infografics
        }
    },
    last_heartbeat: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    api_key: {
        type: DataTypes.STRING(60),
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'Device',
    tableName: 'devices',
    timestamps: false,
    indexes: [
        { fields: ['parking_lot_id'] },
        { fields: ['name'], unique: true }
    ],
    hooks: {
        beforeCreate: Device.hashApiKey,
        beforeUpdate: Device.hashApiKey
    }
});

Device.Authority = {
    PARKOMETER: 0,
    INFO: 1,
    COUNTER: 2
}

Device.belongsTo(ParkingLot, {
    foreignKey: 'parking_lot_id',
    targetKey: 'id',
    onDelete: 'SET NULL'
})

ParkingLot.hasMany(Device, {
    foreignKey: 'parking_lot_id'
})

module.exports = Device;