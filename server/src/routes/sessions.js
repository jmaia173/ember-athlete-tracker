const express = require('express');
const { Session } = require('../models');
const { requireAuth, requireRole } = require('../middleware/auth');
const { validateSession } = require('../services/sessionValidation');

const router = express.Router();

// Every route requires a logged-in athlete and only touches that athlete's data.
router.use(requireAuth, requireRole('athlete'));

// POST /api/sessions
router.post('/', async (req, res) => {
  const error = validateSession(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  try {
    const session = await Session.create({
      userId: req.user.id,
      type: req.body.type,
      durationMinutes: Number(req.body.durationMinutes),
      effort: Number(req.body.effort),
    });
    return res.status(201).json({ session });
  } catch (err) {
    console.error('Create session error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/sessions
router.get('/', async (req, res) => {
  try {
    const sessions = await Session.findAll({
      where: { userId: req.user.id },
      order: [['performedAt', 'DESC'], ['id', 'DESC']],
    });
    return res.json({ sessions });
  } catch (err) {
    console.error('List sessions error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
