const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Session = sequelize.define('Session', {
  type: { type: DataTypes.STRING, allowNull: false },
  durationMinutes: { type: DataTypes.INTEGER, allowNull: false },
  effort: { type: DataTypes.INTEGER, allowNull: false },
  performedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
});

module.exports = Session;
