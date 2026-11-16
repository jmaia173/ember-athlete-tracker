// Central place to register models and associations.
const User = require('./User');
const Session = require('./Session');

User.hasMany(Session, { foreignKey: 'userId', onDelete: 'CASCADE' });
Session.belongsTo(User, { foreignKey: 'userId' });

module.exports = { User, Session };
