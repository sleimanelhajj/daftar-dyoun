const express = require('express');
const router = express.Router();
const Msarif = require('../models/Msarif');
const auth = require('../middleware/auth');

// Get all dyoun for the logged-in user
router.get('/', auth, async (req, res) => {
  const dyoun = await Msarif.find({ user: req.userId });
  res.json(dyoun);
});

// Add or update dyoun (bulk)
router.post('/bulk', auth, async (req, res) => {
  await Msarif.deleteMany({ user: req.userId });
  // Attach user ID to each debt
  const debtsWithUser = req.body.map(d => ({ ...d, user: req.userId }));
  await Msarif.insertMany(debtsWithUser);
  res.json({ status: 'ok' });
});

module.exports = router;