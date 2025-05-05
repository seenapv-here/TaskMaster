const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');

// Add comment with optional attachment
router.post('/:taskId', authMiddleware, upload.single('attachment'), async (req, res) => {
  const { content } = req.body;
  const { taskId } = req.params;

  try {
    const comment = await Comment.create({
      taskId,
      author: req.userId,
      content,
      attachment: req.file ? req.file.filename : null
    });

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add comment' });
  }
});

// Get comments for a task
router.get('/:taskId', authMiddleware, async (req, res) => {
  try {
    const comments = await Comment.find({ taskId: req.params.taskId })
      .populate('author', 'name email');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
});

module.exports = router;
