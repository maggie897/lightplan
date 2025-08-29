const mongoose = require('mongoose');
const TaskSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  title: {type: String, required: true},
  completed:{type: Boolean, default: false},
  tag: {
    type: String, 
    enum:['Routine', 'Event', 'Deadline','Other'],
    default: 'Other',
  },
  imagePath: {type: String},
  details: {
    type: String,
    default: ''
  },
  dueDate:{type: Date},
  dueTime: {type: String},
  isRecurring: {type: Boolean, default: false},
  recurrence: {
    frequency: {type: String, enum: ['None', 'Daily', 'Weekly', 'Monthly'], default: 'None'},
    interval: {type: Number, default: 1},
    endDate: {type: Date}
  },
  reminder: {type: Number, default: 0}
}, {timestamps: true});

module.exports = mongoose.model('Task', TaskSchema); 