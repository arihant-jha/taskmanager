const mongoose = require('mongoose');

//Task schema
const taskSchema = new mongoose.Schema({
  taskName: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  dueDate: { 
    type: Date, 
    required: true 
  },
  period: { 
    type: String, 
    required: true 
  },
  periodType: {
    type: String,
    enum: ['monthly', 'quarterly', 'yearly'],
    required: true,
  },
  taskListId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'TaskList', 
    required: true 
  },
  taskList: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TaskList',
  }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
