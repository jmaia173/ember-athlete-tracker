const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CheckIn = sequelize.define(
  'CheckIn',
  {
    date: { type: DataTypes.DATEONLY, allowNull: false },
    sleepHours: { type: DataTypes.FLOAT, allowNull: false },
    soreness: { type: DataTypes.INTEGER, allowNull: false },
    energy: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    // Enforces one check-in per athlete per day at the database level.
    indexes: [{ unique: true, fields: ['userId', 'date'] }],
  }
);

module.exports = CheckIn;
