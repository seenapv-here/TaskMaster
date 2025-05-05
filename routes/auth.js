const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
//const authMiddleware = require('../middlewares/authMiddleware');

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: 'User created', user: { id: user._id, name, email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// // Update
// router.put('/:id', authMiddleware, async (req, res) => {
//   const { name, email } = req.body;
//   const updatedUser = await User.findByIdAndUpdate(
//     req.params.id,
//     { name, email },
//     { new: true }
//   ).select('-password');
//   res.json(updatedUser);
// });

// // Update User Profile
// router.put('/:id', authMiddleware, async (req, res) => {
//     const { name, email } = req.body;
  
//     try {
//       if (!name && !email) {
//         return res.status(400).json({ message: 'Nothing to update' });
//       }
  
//       // Optional: Check if the ID is valid
//       if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//         return res.status(400).json({ message: 'Invalid user ID' });
//       }
  
//       const updatedUser = await User.findByIdAndUpdate(
//         req.params.id,
//         { $set: { name, email } },
//         { new: true, runValidators: true }
//       ).select('-password');
  
//       if (!updatedUser) {
//         return res.status(404).json({ message: 'User not found' });
//       }
  
//       res.json(updatedUser);
//     } catch (err) {
//       console.error('Update Error:', err);
//       res.status(500).json({ message: 'Server error' });
//     }
//   });
  

// // Get
// router.get('/:id', authMiddleware, async (req, res) => {
//   const user = await User.findById(req.params.id).select('-password');
//   res.json(user);
// });

module.exports = router;
