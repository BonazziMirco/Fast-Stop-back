const { URL } = require('url');

function buildConfig(connectionUrl, useSsl = false) {
  const parsed = new URL(connectionUrl);

  return {
    username: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace(/^\//, ''),
    host: parsed.hostname,
    port: parsed.port ? Number(parsed.port) : 5432,
    dialect: 'postgres',
    ...(useSsl
      ? {
          dialectOptions: {
            ssl: {
              require: true,
              rejectUnauthorized: false
            }
          }
        }
      : {})
  };
}

const connectionUrl = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;

if (!connectionUrl) {
  throw new Error('Set SUPABASE_DATABASE_URL or DATABASE_URL before running sequelize-cli');
}

module.exports = {
  development: buildConfig(connectionUrl),
  test: buildConfig(connectionUrl),
  production: buildConfig(connectionUrl, true)
};
