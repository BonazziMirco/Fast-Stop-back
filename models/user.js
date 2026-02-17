const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/database');

class User extends Model {

    async checkPassword(password) {
        return bcrypt.compare(password, this.password);
    }

    async checkCarPlate(carPlate) {
        return bcrypt.compare(carPlate, this.car_plate);
    }


    static async hashPassword(user) {
        if (user.changed('password')) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        }
    }

    static async hashPlate(user) {
        if (user.changed('car_plate')) {
            const salt = await bcrypt.genSalt(10);
            user.car_plate = await bcrypt.hash(user.car_plate, salt);
        }
    }
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
            notEmpty: true
        }
    },
    password: {
        type: DataTypes.STRING(60), // bcrypt hash length
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [60, 60] // Ensure it's a bcrypt hash
        }
    },
    authority: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0,
            max: 3
        }
    },
    car_plate: {
        type: DataTypes.STRING(60),
        allowNull: true,
        validate: {
            len: [60, 60]
        },
        field: 'car_plate'
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active'
    }
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    underscored: true,
    hooks: {
        beforeCreate: [User.hashPassword, User.hashPlate],
        beforeUpdate: [User.hashPassword, User.hashPlate]
    },
    indexes: [
        { unique: true, fields: ['email'] },
        { fields: ['car_plate'] }
    ]
});

// Authority constants
User.Authority = {
    DRIVER: 0,
    VIEW_ONLY: 1,
    OPERATOR: 2,
    ADMIN: 3
};

module.exports = User;