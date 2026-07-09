/**
 * Test per verificare che l'app si carica correttamente
 */
describe('App Setup', () => {
  test('App module should load without errors', () => {
    const app = require('../app');
    expect(app).toBeDefined();
    expect(typeof app === 'function').toBe(true);
  });

  test('Express app should have use method', () => {
    const app = require('../app');
    expect(typeof app.use).toBe('function');
  });
});

