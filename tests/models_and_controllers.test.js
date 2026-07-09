/**
 * Test per i modelli del database
 */
describe('Database Models', () => {
  test('Models should be exported', () => {
    const models = require('../models');
    expect(models).toBeDefined();
  });

  test('Models should have sequelize instance', () => {
    const models = require('../models');
    expect(models.sequelize).toBeDefined();
  });

  test('Models should have Sequelize constructor', () => {
    const models = require('../models');
    expect(models.Sequelize).toBeDefined();
  });

  test('Device model should be available', () => {
    const models = require('../models');
    const { Device } = models;
    expect(Device).toBeDefined();
  });

  test('User model should be available', () => {
    const models = require('../models');
    const { User } = models;
    expect(User).toBeDefined();
  });

  test('ParkingLot model should be available', () => {
    const models = require('../models');
    const { ParkingLot } = models;
    expect(ParkingLot).toBeDefined();
  });

  test('ParkingSpot model should be available', () => {
    const models = require('../models');
    const { ParkingSpot } = models;
    expect(ParkingSpot).toBeDefined();
  });

  test('Should have core database models defined', () => {
    const models = require('../models');
    expect(models).toBeDefined();
    expect(models.sequelize).toBeDefined();
  });
});

/**
 * Test per i controller
 */
describe('Controllers', () => {
  test('Auth controller should be defined', () => {
    const authController = require('../controllers/auth_controller');
    expect(authController).toBeDefined();
  });

  test('Auth controller should have controller methods', () => {
    const authController = require('../controllers/auth_controller');
    expect(typeof authController).toBe('object');
  });

  test('Profile controller should be defined', () => {
    const profileController = require('../controllers/profile_controller');
    expect(profileController).toBeDefined();
  });

  test('Parking controller should be defined', () => {
    const parkingController = require('../controllers/parking_controller');
    expect(parkingController).toBeDefined();
  });

  test('Parkometer controller should be defined', () => {
    const parkometerController = require('../controllers/parkometer_controller');
    expect(parkometerController).toBeDefined();
  });

  test('Reports controller should be defined', () => {
    const reportsController = require('../controllers/reports_controller');
    expect(reportsController).toBeDefined();
  });
});

