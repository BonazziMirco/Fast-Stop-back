import { Sequelize, DataTypes, Model } from 'sequelize';
import env from '#start/env'
const sequelize = new Sequelize(env.DATABASE_URL);

class user extends Model {}

user.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: DataTypes.STRING,
    surname: DataTypes.STRING,
    authority: DataTypes.TINYINT,       // 0 = driver, 1 = view only, 2 = operator, 3 = admin
    car_plate: DataTypes.STRING
}, {
    sequelize,
    modelName: 'user',
    tableName: 'User'
});

export default user;