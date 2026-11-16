const request = require('supertest');
const app = require('../src/app');
const sequelize = require('../src/config/database');
require('../src/models');

// Fresh in-memory database for each test file.
async function resetDb() {
  await sequelize.sync({ force: true });
}

async function closeDb() {
  await sequelize.close();
}

// Registers a user and returns { token, user }.
async function registerUser(overrides = {}) {
  const res = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Test User',
      email: `user${Math.random().toString(36).slice(2)}@test.com`,
      password: 'password123',
      role: 'athlete',
      ...overrides,
    });
  return res.body;
}

module.exports = { app, resetDb, closeDb, registerUser };
