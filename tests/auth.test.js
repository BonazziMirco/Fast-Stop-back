/**
 * Test per le rotte di autenticazione
 */
describe('Auth Routes', () => {
  let authRouter;

  beforeAll(() => {
    authRouter = require('../routes/auth');
  });

  test('Auth router should be defined', () => {
    expect(authRouter).toBeDefined();
  });

  test('Auth router should have router methods', () => {
    expect(typeof authRouter.post).toBe('function');
  });

  test('Should define login route', () => {
    // Verifichiamo che il router è stato configurato correttamente
    expect(authRouter.stack).toBeDefined();
    const routes = authRouter.stack.map(layer => layer.route?.path).filter(Boolean);
    expect(routes).toContain('/login');
  });

  test('Should define register route', () => {
    const routes = authRouter.stack.map(layer => layer.route?.path).filter(Boolean);
    expect(routes).toContain('/register');
  });

  test('Should define logout route', () => {
    const routes = authRouter.stack.map(layer => layer.route?.path).filter(Boolean);
    expect(routes).toContain('/logout');
  });

  test('Should define device register route', () => {
    const routes = authRouter.stack.map(layer => layer.route?.path).filter(Boolean);
    expect(routes).toContain('/device/register');
  });

  test('Should define device login route', () => {
    const routes = authRouter.stack.map(layer => layer.route?.path).filter(Boolean);
    expect(routes).toContain('/device/login');
  });
});

