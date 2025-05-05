const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');

// Get user profile
router.get('/:id', authMiddleware, async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  res.json(user);
});

// Update User Profile
router.put('/:id', authMiddleware, async (req, res) => {
  const { name, email } = req.body;
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    { name, email },
    { new: true }
  ).select('-password');
  res.json(updatedUser);
});

module.exports = router;