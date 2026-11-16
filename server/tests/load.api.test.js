const request = require('supertest');
const { app, resetDb, closeDb, registerUser } = require('./helpers');

let athlete;

beforeAll(async () => {
  await resetDb();
  athlete = await registerUser({ role: 'athlete' });
});
afterAll(closeDb);

const auth = () => ({ Authorization: `Bearer ${athlete.token}` });

describe('GET /api/load/weekly', () => {
  test('requires authentication', async () => {
    const res = await request(app).get('/api/load/weekly');
    expect(res.status).toBe(401);
  });

  test('returns zero load with no sessions', async () => {
    const res = await request(app).get('/api/load/weekly').set(auth());
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ thisWeek: 0, lastWeek: 0 });
  });

  test('includes a newly logged session in this week\'s load', async () => {
    await request(app).post('/api/sessions').set(auth())
      .send({ type: 'practice', durationMinutes: 60, effort: 7 });
    const res = await request(app).get('/api/load/weekly').set(auth());
    expect(res.body.thisWeek).toBe(420);
  });

  test('rejects a badly formatted date', async () => {
    const res = await request(app).get('/api/load/weekly?today=nope').set(auth());
    expect(res.status).toBe(400);
  });
});
