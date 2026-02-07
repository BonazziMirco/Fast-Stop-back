import { Sequelize, DataTypes, Model } from 'sequelize';
import env from '#start/env'
const sequelize = new Sequelize(env.DATABASE_URL);

class parking_lot extends Model {}

parking_lot.init({
    id: DataTypes.CHAR,
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    zone_id: DataTypes.STRING,            // actual name of the zone, or similar identifier (e.g. color)
    capacity: DataTypes.TINYINT,
    availableSpots: DataTypes.TINYINT      // can be changed to occupiedSpots if needed
}, {
    sequelize,
    modelName: 'parking_lot',
    tableName: 'Parking_lot'
});

export default parking_lot;