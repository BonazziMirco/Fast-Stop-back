const { Sequelize } = require('sequelize');
const env = require('./env');

const isProduction = env.NODE_ENV === 'production';
const connectionUrl = isProduction
    ? (env.SUPABASE_DATABASE_URL || env.DATABASE_URL)
    : (env.DATABASE_URL || env.SUPABASE_DATABASE_URL);

if (!connectionUrl) {
    throw new Error(`Missing database connection URL for ${env.NODE_ENV} environment`);
}

const sequelize = new Sequelize(connectionUrl, {
    dialect: 'postgres',
    logging: env.LOG_LEVEL === 'debug' ? console.log : false,
    dialectOptions: isProduction
        ? {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
        : undefined,
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