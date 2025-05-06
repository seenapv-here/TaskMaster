const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const authMiddleware = require('../middlewares/authMiddleware');
const { generateTaskDescription } = require('../utils/ai');

// Create Task
router.post('/', authMiddleware, async (req, res) => {
    const { title, description, dueDate, assignedTo } = req.body;
    try {
      const task = await Task.create({
        title,
        description,
        dueDate,
        createdBy: req.userId,
        assignedTo
      });
      res.status(201).json(task);
    } catch (err) {
        console.error('Register Error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
  });
  

// GET tasks with optional filters: status and search
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, search } = req.query;

    const filter = { assignedTo: req.userId };

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const tasks = await Task.find(filter).populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

  
// PATCH /api/tasks/:id/complete — Mark task as completed
router.patch('/:id/complete', authMiddleware, async (req, res) => {
    try {
      const taskId = req.params.id;
      const task = await Task.findById(taskId);
      
      if (!task) return res.status(404).json({ message: 'Task not found' });
  
      // Optional: ensure only assigned user can mark as complete
    //   if (task.assignedTo.toString() !== req.user.id) {
    //     return res.status(403).json({ message: 'Not authorized to update this task' });
    //   }
  
      task.status = 'completed';
      await task.save();
  
      res.json({ message: 'Task marked as completed', task });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // PATCH /api/tasks/:id/assign — Assign a task to another user
router.patch('/:id/assign', authMiddleware, async (req, res) => {
    const { userId } = req.body; // ID of the user to assign the task to
  
    try {
      const task = await Task.findById(req.params.id);
      if (!task) return res.status(404).json({ message: 'Task not found' });
  
      // Optionally: Check if the user assigning has permission (e.g., task.creator)
    //   if (task.creator.toString() !== req.userId) {
    //     return res.status(403).json({ message: 'Only task creator can assign task' });
    //   }
  
      task.assignedTo = userId;
      await task.save();
  
      res.json({ message: 'Task assigned successfully', task });

      //Emit notification when task is assigned or updated
      const targetUserId = userId; // whoever the task is assigned to
      const socketId = req.onlineUsers.get(targetUserId);

      if (socketId) {
        req.io.to(socketId).emit('task-notification', {
          message: `A task has been assigned/updated for you.`,
          taskId: task._id,
        });
      }
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
// Generate task description
router.post('/generate-description', authMiddleware, async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required." });

  const prompt = `Write a clear and detailed task description for the following title: "${title}"`;
  const description = await generateTaskDescription(prompt);
  res.json({ title, description });
});

module.exports = router;
