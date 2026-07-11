const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const { cleanEnv, str, port, num } = require('envalid');

const envCandidates = [
    path.join(process.cwd(), '.env'),
    path.resolve(__dirname, '..', '.env')
];

const envPath = envCandidates.find((candidate) => fs.existsSync(candidate));
dotenv.config(envPath ? { path: envPath } : undefined);

const Env = cleanEnv(process.env, {
    TZ: str({ default: 'UTC' }),
    NODE_ENV: str({ choices: ['development', 'production', 'test'] }),
    PORT: port(),
    HOST: str(),
    LOG_LEVEL: str({ choices: ['fatal', 'error', 'warn', 'info', 'debug', 'trace'] }),
    DATABASE_URL: str({ default: '' }),
    SUPABASE_DATABASE_URL: str({ default: '' }),

    // user jwt
    USER_JWT_SECRET: str(),
    USER_JWT_EXPIRES_IN: str({ default: '1h' }),
    USER_JWT_COOKIE_MAX_AGE: num({ default: 10 * 60 * 1000 }),
    USER_JWT_REFRESH_SECRET: str(),
    USER_JWT_REFRESH_EXPIRES_IN: str({ default: '7d' }),
    USER_JWT_REFRESH_COOKIE_MAX_AGE: num({ default: 7 * 24 * 60 * 60 * 1000 }),

    // device jwt
    DEVICE_JWT_SECRET: str(),
    DEVICE_JWT_COOKIE_MAX_AGE: num({ default: 30 * 24 * 60 * 60 * 1000 }),
    DEVICE_JWT_EXPIRES_IN: str({ default: '30d' }),
    DEVICE_JWT_REFRESH_SECRET: str(),
    DEVICE_JWT_REFRESH_EXPIRES_IN: str({ default: '365d' }),
    DEVICE_JWT_REFRESH_COOKIE_MAX_AGE: num({ default: 365 * 24 * 60 * 60 * 1000 }),
});

if (Env.NODE_ENV === 'production') {
    if (!Env.SUPABASE_DATABASE_URL && !Env.DATABASE_URL) {
        console.log(Env.SUPABASE_DATABASE_URL!='' && Env.SUPABASE_DATABASE_URL!=null)
        throw new Error('Set SUPABASE_DATABASE_URL or DATABASE_URL for production');
    }
} else if (!Env.DATABASE_URL && !Env.SUPABASE_DATABASE_URL) {
    throw new Error('Set DATABASE_URL or SUPABASE_DATABASE_URL for development and test');
}

module.exports = Env;