const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/create', authMiddleware, async (req, res) => {
  const { name } = req.body;
  const userId = req.userId;
  const team = await Team.create({ name, members: [userId], createdBy: userId });

  await User.findByIdAndUpdate(userId, { $push: { teams: team._id } });
  res.status(201).json(team);
});

router.post('/invite', authMiddleware, async (req, res) => {
  const { teamId, userId } = req.body;

  await Team.findByIdAndUpdate(teamId, { $addToSet: { members: userId } });
  await User.findByIdAndUpdate(userId, { $addToSet: { teams: teamId } });

  res.status(200).json({ message: 'User added to team' });
});

module.exports = router;