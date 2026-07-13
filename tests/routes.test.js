/**
 * Test per le rotte aggiuntive
 */
describe('Additional Routes', () => {

  test('Reports routes should be valid', () => {
    const reportsRouter = require('../routes/reports');
    expect(reportsRouter).toBeDefined();
    expect(typeof reportsRouter.use).toBe('function');
  });

  test('User Management routes should be valid', () => {
    const userManagementRouter = require('../routes/user_management');
    expect(userManagementRouter).toBeDefined();
    expect(typeof userManagementRouter.use).toBe('function');
  });

  test('Reports router should support GET requests', () => {
    const reportsRouter = require('../routes/reports');
    expect(typeof reportsRouter.get).toBe('function');
  });

  test('User Management router should have routes defined', () => {
    const userManagementRouter = require('../routes/user_management');
    expect(userManagementRouter.stack).toBeDefined();
    expect(Array.isArray(userManagementRouter.stack)).toBe(true);
  });
});

