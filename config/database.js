const { Sequelize } = require('sequelize');
const env = require('./env');

const sequelize = new Sequelize(env.DATABASE_URL, {
    dialect: 'postgres',
    logging: env.LOG_LEVEL === 'debug' ? console.log : false,
    define: {
        timestamps: true,
        underscored: true,
        freezeTableName: false
    },
    pool: {
        max: 10,
        min: 0,
        idle: 10000
    }
});

module.exports = sequelize;