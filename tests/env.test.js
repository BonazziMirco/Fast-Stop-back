/**
 * Test per la configurazione dell'ambiente
 */
describe('Environment Configuration', () => {
  let env;

  beforeAll(() => {
    env = require('../config/env');
  });

  test('Environment should be defined', () => {
    expect(env).toBeDefined();
  });

  test('NODE_ENV should be defined', () => {
    expect(env.NODE_ENV).toBeDefined();
    expect(['development', 'production', 'test']).toContain(env.NODE_ENV);
  });

  test('PORT should be defined and be a number', () => {
    expect(env.PORT).toBeDefined();
    expect(typeof env.PORT).toBe('number');
  });

  test('HOST should be defined', () => {
    expect(env.HOST).toBeDefined();
    expect(typeof env.HOST).toBe('string');
  });

  test('LOG_LEVEL should be one of the allowed values', () => {
    const allowedLevels = ['fatal', 'error', 'warn', 'info', 'debug', 'trace'];
    expect(allowedLevels).toContain(env.LOG_LEVEL);
  });

  test('Should have either DATABASE_URL or SUPABASE_DATABASE_URL', () => {
    const hasDbUrl = Boolean(env.DATABASE_URL) || Boolean(env.SUPABASE_DATABASE_URL);
    expect(hasDbUrl).toBe(true);
  });

  test('JWT secrets should be defined', () => {
    expect(env.USER_JWT_SECRET).toBeDefined();
    expect(env.USER_JWT_REFRESH_SECRET).toBeDefined();
    expect(env.DEVICE_JWT_SECRET).toBeDefined();
    expect(env.DEVICE_JWT_REFRESH_SECRET).toBeDefined();
  });

  test('JWT expiration times should have reasonable defaults', () => {
    expect(env.USER_JWT_EXPIRES_IN).toBe('1h');
    expect(env.USER_JWT_REFRESH_EXPIRES_IN).toBe('7d');
    expect(env.DEVICE_JWT_EXPIRES_IN).toBe('30d');
    expect(env.DEVICE_JWT_REFRESH_EXPIRES_IN).toBe('365d');
  });
});

