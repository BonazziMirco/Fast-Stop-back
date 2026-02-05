import * as dotenv from 'dotenv'
import * as path from 'path'
import { cleanEnv, str, port, num } from 'envalid'

dotenv.config({ path: path.join(process.cwd(), '.env') })

const Env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'production', 'test'] }),
  PORT: port(),
  APP_KEY: str(),
  HOST: str(),
  LOG_LEVEL: str({ choices: ['fatal', 'error', 'warn', 'info', 'debug', 'trace'] }),
  MONGO_URI: str(),
  JWT_SECRET: str(),
  JWT_EXPIRES_IN: str({ default: '1h' }),
  SESSION_DRIVER: str({ choices: ['cookie', 'memory'] }),

  JWT_REFRESH_SECRET: str(),
  JWT_REFRESH_EXPIRES_IN: str({ default: '7d' }),
  JWT_REFRESH_COOKIE_MAX_AGE: num({ default: 7 * 24 * 60 * 60 * 1000 }),
})

export default Env