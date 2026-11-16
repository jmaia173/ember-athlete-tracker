require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/database');
require('./models');

const PORT = process.env.PORT || 5001;

async function start() {
  await sequelize.sync();
  const server = app.listen(PORT);

  server.on('listening', () => {
    console.log(`Ember API running on port ${PORT}`);
  });
  server.on('error', (err) => {
    console.error('Server error:', err.message);
    process.exit(1);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
