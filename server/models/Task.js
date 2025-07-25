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
  dueDate:{type: Date},
}, {timestamps: true});

module.exports = mongoose.model('Task', TaskSchema); 