const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('athlete', 'coach'),
    allowNull: false,
    defaultValue: 'athlete',
  },
});

// Never expose passwordHash in API responses.
User.prototype.toSafeJSON = function toSafeJSON() {
  return {
    id: this.id,
    name: this.name,
    email: this.email,
    role: this.role,
  };
};

module.exports = User;
