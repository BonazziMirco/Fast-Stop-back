const request = require('supertest');
const app = require('../app');
const User = require('../models/user');

// Integration test: attempt to register the same email twice -> expect second to fail
describe('Auth functions test', () => {
  const newAccountTest = { email: 'test@example.com', password: 'Password123!' };
  const wrongAccountTest = { email: 'wrongtest@example.com', password: 'Password123!' };
  const adminTest = { email: 'admin@mail.com', password: 'password' };

  afterAll(async () => {
    // cleanup created users
    try {
      await User.destroy({ where: { email: newAccountTest.email } });
    } catch (e) {}
  });

  test('registering with a new email should return 201', async () => {
    const response = await request(app).post('/api/auth/register').send(newAccountTest);
    expect(response.status).toBe(201);
    expect(response.body.user.email).toBe(newAccountTest.email);
    expect(response.body.user.authority).toBe(0);
  })

  test('registering twice with same email should return 400', async () => {
    const response = await request(app).post('/api/auth/register').send(adminTest);
    expect(response.status).toBe(400);
    expect((response.body.message)).toMatch('L\'utente esiste già');
  }, 20000);

  test('Log in sucessfully', async () => {
    const response = await request(app).post('/api/auth/login').send(adminTest);
    expect(response.status).toBe(200);
    expect(response.body.user.email).toBe(adminTest.email);
    expect(response.body.user.authority).toBe(3);
    expect(response.body.token).toBeDefined();
    expect(response.headers['set-cookie']).toBeDefined();
  })

  test('Disable/enable user successfully', async () => {
    const token = (await request(app).post('/api/auth/login').send(adminTest)).body.token;

    const id = (await User.findOne({ where: { email: 'user@mail.com'}})).id;
    const response1 = await request(app).patch('/api/userManagement/users/'+id).set('Authorization', `Bearer ${token}`);
    expect(response1.status).toBe(200);
    expect(response1.body.user.email).toBe('user@mail.com');
    expect(response1.body.user.authority).toBe(0);
    expect(response1.body.user.is_active).toBeFalsy();

    const response2 = await request(app).patch('/api/userManagement/users/'+id).set('Authorization', `Bearer ${token}`);
    expect(response2.status).toBe(200);
    expect(response2.body.user.email).toBe('user@mail.com');
    expect(response2.body.user.authority).toBe(0);
    expect(response2.body.user.is_active).toBeTruthy();
  })

  test('Disable/disable user without authority', async () => {
    const id = (await User.findOne({ where: { email: 'user@mail.com'}})).id;
    const response = await request(app).patch('/api/userManagement/users/'+id).send();
    expect(response.status).toBe(401);
  })

  test('Disable/disable non existing user', async () => {
    const token = (await request(app).post('/api/auth/login').send(adminTest)).body.token;

    const response = await request(app).patch('/api/userManagement/users/99999999999999').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(404);
    expect((response.body.message)).toBe('Utente non trovato');
  })

  test('Log in failure with email and password', async () => {
    const response = await request(app).post('/api/auth/login').send(wrongAccountTest);
    expect(response.status).toBe(400);
    expect((response.body.message)).toBe('Credenziali invalide');
  })
});
