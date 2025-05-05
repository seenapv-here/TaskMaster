const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  attachment: String, // filename or URL
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
