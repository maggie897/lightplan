const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  // Reference to the user who created the task
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Task title
  title: {
    type: String,
    required: true
  },

  // Task completion status
  completed: {
    type: Boolean,
    default: false
  },

  // Task category/tag
  tag: {
    type: String,
    enum: ['Routine', 'Event', 'Deadline', 'Other'],
    default: 'Other'
  },

  // S3 object key (for fetching image via signed URL)
  imageKey: {
    type: String
  },

  // Additional task description
  details: {
    type: String,
    default: ''
  },

  // Due date (optional)
  dueDate: {
    type: Date
  },

  // Due time (optional)
  dueTime: {
    type: String
  },

  // Is this task recurring?
  isRecurring: {
    type: Boolean,
    default: false
  },

  // Recurrence details
  recurrence: {
    frequency: {
      type: String,
      enum: ['None', 'Daily', 'Weekly', 'Monthly'],
      default: 'None'
    },
    interval: {
      type: Number,
      default: 1
    },
    endDate: {
      type: Date
    }
  },

  // Reminder in minutes before due time
  reminder: {
    type: Number,
    default: 0
  }

}, {
  timestamps: true  // Automatically adds createdAt and updatedAt
});

module.exports = mongoose.model('Task', TaskSchema);