const request = require('supertest');
const { app, resetDb, closeDb } = require('./helpers');

beforeAll(resetDb);
afterAll(closeDb);

const newUser = { name: 'Joao', email: 'joao@test.com', password: 'password123', role: 'athlete' };

describe('POST /api/auth/register', () => {
  test('creates an account and never returns the password hash', async () => {
    const res = await request(app).post('/api/auth/register').send(newUser);
    expect(res.status).toBe(201);
    expect(res.body.token).toEqual(expect.any(String));
    expect(res.body.user).toMatchObject({ name: 'Joao', email: 'joao@test.com', role: 'athlete' });
    expect(JSON.stringify(res.body)).not.toMatch(/passwordHash|password123/);
  });

  test('rejects a duplicate email', async () => {
    const res = await request(app).post('/api/auth/register').send(newUser);
    expect(res.status).toBe(409);
  });

  test('rejects a short password', async () => {
    const res = await request(app).post('/api/auth/register').send({ ...newUser, email: 'a@test.com', password: 'short' });
    expect(res.status).toBe(400);
  });

  test('rejects an invalid email', async () => {
    const res = await request(app).post('/api/auth/register').send({ ...newUser, email: 'not-an-email' });
    expect(res.status).toBe(400);
  });

  test('rejects an invalid role', async () => {
    const res = await request(app).post('/api/auth/register').send({ ...newUser, email: 'b@test.com', role: 'admin' });
    expect(res.status).toBe(400);
  });
});

describe('POST /api/auth/login', () => {
  test('logs in with correct credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: newUser.email, password: newUser.password });
    expect(res.status).toBe(200);
    expect(res.body.token).toEqual(expect.any(String));
  });

  test('rejects a wrong password with a clear error', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: newUser.email, password: 'wrong-password' });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid email or password');
  });

  test('rejects an unknown email', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'nobody@test.com', password: 'password123' });
    expect(res.status).toBe(401);
  });

  test('rejects missing fields', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.status).toBe(400);
  });
});

describe('GET /api/auth/me', () => {
  test('requires a token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  test('rejects an invalid token', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', 'Bearer garbage');
    expect(res.status).toBe(401);
  });

  test('returns the current user with a valid token', async () => {
    const login = await request(app).post('/api/auth/login').send({ email: newUser.email, password: newUser.password });
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${login.body.token}`);
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(newUser.email);
  });
});
