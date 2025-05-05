const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const authMiddleware = require('../middlewares/authMiddleware');

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
  

// Get My Tasks
router.get('/', authMiddleware, async (req, res) => {
    try {
      const tasks = await Task.find({ createdBy: req.userId }).populate('assignedTo', 'name email');
      res.json(tasks);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch tasks' });
    }
  });
  
// PATCH /api/tasks/:id/complete — Mark task as completed
router.patch('/:id/complete', authMiddleware, async (req, res) => {
    try {
      const taskId = req.params.id;
        
      console.log(taskId);
      const task = await Task.findById(taskId);
      console.log(task);
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
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
module.exports = router;
