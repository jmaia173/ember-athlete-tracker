const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const sessionRoutes = require('./routes/sessions');
const checkInRoutes = require('./routes/checkins');

const app = express();

// Allow the configured client URL plus any localhost port (Vite may pick 5174, etc.).
const allowedOrigin = (origin, callback) => {
  const isLocalhost = !origin || /^http:\/\/localhost:\d+$/.test(origin);
  if (isLocalhost || origin === process.env.CLIENT_URL) {
    return callback(null, true);
  }
  return callback(new Error('Not allowed by CORS'));
};

app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/checkins', checkInRoutes);

module.exports = app;
