/**
 * Test per il middleware di logging
 */
describe('Logger Middleware', () => {
  test('Logger module should be defined', () => {
    const logger = require('../middleware/logger_middleware');
    expect(logger).toBeDefined();
    expect(typeof logger).toBe('function');
  });

  test('Logger should be a middleware function', () => {
    const logger = require('../middleware/logger_middleware');
    // Middleware funzione ha 3 parametri: req, res, next
    expect(logger.length).toBe(3);
  });
});

/**
 * Test per il middleware di gestione errori
 */
describe('Error Handling Middleware', () => {
  test('Error handler module should be defined', () => {
    const errorHandler = require('../middleware/error_handling_middleware');
    expect(errorHandler).toBeDefined();
    expect(typeof errorHandler).toBe('function');
  });

  test('Error handler should be a middleware function', () => {
    const errorHandler = require('../middleware/error_handling_middleware');
    // Il middleware di error handling ha 4 parametri: err, req, res, next
    expect(errorHandler.length).toBe(4);
  });
});

/**
 * Test per il middleware JWT
 */
describe('JWT Auth Middleware', () => {
  test('JWT middleware should be defined', () => {
    const jwtMiddleware = require('../middleware/jwt_auth_middleware');
    expect(jwtMiddleware).toBeDefined();
  });

  test('JWT middleware should export functions', () => {
    const jwtMiddleware = require('../middleware/jwt_auth_middleware');
    expect(typeof jwtMiddleware).toBe('object');
  });
});

/**
 * Test per il middleware di autorità
 */
describe('Authority Middleware', () => {
  test('Authority middleware should be defined', () => {
    const authorityMiddleware = require('../middleware/authority_middleware');
    expect(authorityMiddleware).toBeDefined();
  });

  test('Authority middleware should have requireAdmin method', () => {
    const authorityMiddleware = require('../middleware/authority_middleware');
    expect(authorityMiddleware.requireAdmin).toBeDefined();
    expect(typeof authorityMiddleware.requireAdmin).toBe('function');
  });
});

