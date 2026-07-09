/**
 * Test per le rotte di profilo utente
 */
describe('Profile Routes', () => {
  test('Profile router module should be valid', () => {
    const profileRouter = require('../routes/profile');
    expect(profileRouter).toBeDefined();
    expect(typeof profileRouter.use).toBe('function');
  });
});

