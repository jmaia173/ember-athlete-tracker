const express = require('express');
const { Op } = require('sequelize');
const { Session } = require('../models');
const { requireAuth, requireRole } = require('../middleware/auth');
const {
  calculateWeeklyLoad,
  startOfWeek,
  addDays,
  toDateString,
} = require('../services/weeklyLoad');

const router = express.Router();
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

router.use(requireAuth, requireRole('athlete'));

// GET /api/load/weekly?today=YYYY-MM-DD&tzOffset=480
// The client sends its local date and timezone offset so weeks match the athlete's calendar.
router.get('/weekly', async (req, res) => {
  const { today, tzOffset } = req.query;

  if (today !== undefined && !DATE_REGEX.test(today)) {
    return res.status(400).json({ error: 'today must be in YYYY-MM-DD format' });
  }

  let tzOffsetMinutes = 0;
  if (tzOffset !== undefined) {
    tzOffsetMinutes = Number(tzOffset);
    if (!Number.isInteger(tzOffsetMinutes) || Math.abs(tzOffsetMinutes) > 840) {
      return res.status(400).json({ error: 'tzOffset must be a valid number of minutes' });
    }
  }

  try {
    const base = today || toDateString(new Date(), tzOffsetMinutes);
    // Only load the two weeks we need (plus a one-day buffer for timezone shifts).
    const since = new Date(`${addDays(startOfWeek(base), -8)}T00:00:00Z`);

    const sessions = await Session.findAll({
      where: { userId: req.user.id, performedAt: { [Op.gte]: since } },
    });

    return res.json(calculateWeeklyLoad(sessions, { today: base, tzOffsetMinutes }));
  } catch (err) {
    console.error('Weekly load error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
