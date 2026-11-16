// Central place to register models and associations.
const User = require('./User');
const Session = require('./Session');
const CheckIn = require('./CheckIn');

User.hasMany(Session, { foreignKey: 'userId', onDelete: 'CASCADE' });
Session.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(CheckIn, { foreignKey: 'userId', onDelete: 'CASCADE' });
CheckIn.belongsTo(User, { foreignKey: 'userId' });

module.exports = { User, Session, CheckIn };
