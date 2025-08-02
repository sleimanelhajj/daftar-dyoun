const express = require('express');
const router = express.Router();
const Dyoun = require('../models/Dyoun');
const auth = require('../middleware/auth');

// Get all dyoun for the logged-in user
router.get('/', auth, async (req, res) => {
  const dyoun = await Dyoun.find({ user: req.userId });
  res.json(dyoun);
});

// Add or update dyoun (bulk)
router.post('/bulk', auth, async (req, res) => {
  await Dyoun.deleteMany({ user: req.userId });
  // Attach user ID to each debt
  const debtsWithUser = req.body.map(d => ({ ...d, user: req.userId }));
  await Dyoun.insertMany(debtsWithUser);
  res.json({ status: 'ok' });
});

module.exports = router;