import { Sequelize, DataTypes, Model } from 'sequelize';
import env from '#start/env'
const sequelize = new Sequelize(env.DATABASE_URL);

class reservation extends Model {}

reservation.init({
    parking_lot_id: DataTypes.CHAR,
    spot_number: DataTypes.TINYINT,
    car_plate: DataTypes.STRING,
    expiration: DataTypes.TIME
}, {
    sequelize,
    modelName: 'reservation',
    tableName: 'Reservation'
});

export default reservation;