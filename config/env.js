const dotenv = require('dotenv');
const path = require('path');
const { cleanEnv, str, port, num } = require('envalid');

dotenv.config({ path: path.join(process.cwd(), '.env') });

const Env = cleanEnv(process.env, {
    TZ: str({ default: 'UTC' }),
    NODE_ENV: str({ choices: ['development', 'production', 'test'] }),
    PORT: port(),
    HOST: str(),
    LOG_LEVEL: str({ choices: ['fatal', 'error', 'warn', 'info', 'debug', 'trace'] }),
    DATABASE_URL: str(),

    // user jwt
    USER_JWT_SECRET: str(),
    USER_JWT_EXPIRES_IN: str({ default: '1h' }),
    USER_JWT_REFRESH_SECRET: str(),
    USER_JWT_REFRESH_EXPIRES_IN: str({ default: '7d' }),
    USER_JWT_REFRESH_COOKIE_MAX_AGE: num({ default: 7 * 24 * 60 * 60 * 1000 }),

    // device jwt
    DEVICE_JWT_SECRET: str(),
    DEVICE_JWT_EXPIRES_IN: str({ default: '30d' }),
    DEVICE_JWT_REFRESH_SECRET: str(),
    DEVICE_JWT_REFRESH_EXPIRES_IN: str({ default: '365d' }),
    DEVICE_JWT_REFRESH_COOKIE_MAX_AGE: num({ default: 365 * 24 * 60 * 60 * 1000 }),
});

module.exports = Env;