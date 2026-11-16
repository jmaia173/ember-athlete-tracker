const { Sequelize } = require('sequelize');
require('dotenv').config();

// Data layer: PostgreSQL in production (DATABASE_URL), SQLite locally and in tests.
let sequelize;
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions:
      process.env.NODE_ENV === 'production'
        ? { ssl: { require: true, rejectUnauthorized: false } }
        : {},
  });
} else {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.NODE_ENV === 'test' ? ':memory:' : './ember.sqlite',
    logging: false,
  });
}

module.exports = sequelize;
