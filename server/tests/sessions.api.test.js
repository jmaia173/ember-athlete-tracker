const request = require('supertest');
const { app, resetDb, closeDb, registerUser } = require('./helpers');

let athlete;
let otherAthlete;
let coach;

beforeAll(async () => {
  await resetDb();
  athlete = await registerUser({ role: 'athlete' });
  otherAthlete = await registerUser({ role: 'athlete' });
  coach = await registerUser({ role: 'coach' });
});
afterAll(closeDb);

const auth = (user) => ({ Authorization: `Bearer ${user.token}` });
const validSession = { type: 'practice', durationMinutes: 60, effort: 7 };

describe('access control', () => {
  test('requires authentication', async () => {
    const res = await request(app).get('/api/sessions');
    expect(res.status).toBe(401);
  });

  test('blocks coaches from athlete session routes', async () => {
    const res = await request(app).post('/api/sessions').set(auth(coach)).send(validSession);
    expect(res.status).toBe(403);
  });
});

describe('POST /api/sessions', () => {
  test('creates a valid session', async () => {
    const res = await request(app).post('/api/sessions').set(auth(athlete)).send(validSession);
    expect(res.status).toBe(201);
    expect(res.body.session).toMatchObject({ type: 'practice', durationMinutes: 60, effort: 7 });
  });

  test('rejects effort outside 1-10', async () => {
    const res = await request(app).post('/api/sessions').set(auth(athlete)).send({ ...validSession, effort: 11 });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Effort/);
  });

  test('rejects missing required fields', async () => {
    const res = await request(app).post('/api/sessions').set(auth(athlete)).send({ type: 'practice' });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/sessions', () => {
  test('lists the athlete\'s new session', async () => {
    const res = await request(app).get('/api/sessions').set(auth(athlete));
    expect(res.status).toBe(200);
    expect(res.body.sessions).toHaveLength(1);
  });

  test('athletes only see their own sessions', async () => {
    const res = await request(app).get('/api/sessions').set(auth(otherAthlete));
    expect(res.status).toBe(200);
    expect(res.body.sessions).toHaveLength(0);
  });
});
