/**
 * Test per le rotte di parcheggio
 */
describe('Parking Routes', () => {
  test('Parking routes module should be valid', () => {
    const parkingRouter = require('../routes/parkings');
    expect(parkingRouter).toBeDefined();
    expect(typeof parkingRouter.use).toBe('function');
  });

  test('Parking router should have router methods', () => {
    const parkingRouter = require('../routes/parkings');
    const hasGetMethod = typeof parkingRouter.get === 'function';
    const hasPostMethod = typeof parkingRouter.post === 'function';
    expect(hasGetMethod).toBe(true);
    expect(hasPostMethod).toBe(true);
  });
});

