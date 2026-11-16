const request = require('supertest');
const { app, resetDb, closeDb, registerUser } = require('./helpers');

let athlete;
let otherAthlete;

beforeAll(async () => {
  await resetDb();
  athlete = await registerUser({ role: 'athlete' });
  otherAthlete = await registerUser({ role: 'athlete' });
});
afterAll(closeDb);

const auth = (user) => ({ Authorization: `Bearer ${user.token}` });

describe('daily check-ins', () => {
  test('requires authentication', async () => {
    const res = await request(app).post('/api/checkins').send({ sleepHours: 7, soreness: 3, energy: 6 });
    expect(res.status).toBe(401);
  });

  test('creates a check-in', async () => {
    const res = await request(app)
      .post('/api/checkins').set(auth(athlete))
      .send({ date: '2026-11-16', sleepHours: 7.5, soreness: 4, energy: 6 });
    expect(res.status).toBe(201);
    expect(res.body.updated).toBe(false);
  });

  test('resubmitting the same day updates instead of duplicating', async () => {
    const res = await request(app)
      .post('/api/checkins').set(auth(athlete))
      .send({ date: '2026-11-16', sleepHours: 8, soreness: 2, energy: 8 });
    expect(res.status).toBe(200);
    expect(res.body.updated).toBe(true);

    const list = await request(app).get('/api/checkins').set(auth(athlete));
    expect(list.body.checkIns).toHaveLength(1);
    expect(list.body.checkIns[0]).toMatchObject({ sleepHours: 8, soreness: 2, energy: 8 });
  });

  test('a different day creates a second check-in', async () => {
    await request(app)
      .post('/api/checkins').set(auth(athlete))
      .send({ date: '2026-11-17', sleepHours: 6, soreness: 5, energy: 5 });
    const list = await request(app).get('/api/checkins').set(auth(athlete));
    expect(list.body.checkIns).toHaveLength(2);
  });

  test('rejects out-of-range values', async () => {
    const res = await request(app)
      .post('/api/checkins').set(auth(athlete))
      .send({ sleepHours: 25, soreness: 11, energy: 0 });
    expect(res.status).toBe(400);
  });

  test('athletes only see their own check-ins', async () => {
    const res = await request(app).get('/api/checkins').set(auth(otherAthlete));
    expect(res.body.checkIns).toHaveLength(0);
  });
});
