const express = require('express');
const { CheckIn } = require('../models');
const { requireAuth, requireRole } = require('../middleware/auth');
const { validateCheckIn } = require('../services/checkinValidation');

const router = express.Router();

router.use(requireAuth, requireRole('athlete'));

// POST /api/checkins  (creates today's check-in, or updates it if one exists)
router.post('/', async (req, res) => {
  const error = validateCheckIn(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  try {
    const date = req.body.date || new Date().toISOString().slice(0, 10);
    const values = {
      sleepHours: Number(req.body.sleepHours),
      soreness: Number(req.body.soreness),
      energy: Number(req.body.energy),
    };

    const existing = await CheckIn.findOne({ where: { userId: req.user.id, date } });
    if (existing) {
      await existing.update(values);
      return res.json({ checkIn: existing, updated: true });
    }

    const checkIn = await CheckIn.create({ userId: req.user.id, date, ...values });
    return res.status(201).json({ checkIn, updated: false });
  } catch (err) {
    console.error('Check-in error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/checkins  (this athlete's recent check-ins, newest first)
router.get('/', async (req, res) => {
  try {
    const checkIns = await CheckIn.findAll({
      where: { userId: req.user.id },
      order: [['date', 'DESC']],
      limit: 30,
    });
    return res.json({ checkIns });
  } catch (err) {
    console.error('List check-ins error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
