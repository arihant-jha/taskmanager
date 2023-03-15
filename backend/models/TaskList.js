const mongoose = require('mongoose');

const TaskListSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  active: {
    type: Boolean,
    required: true,
  },
});

const TaskList = mongoose.model('TaskList', TaskListSchema);

module.exports = TaskList;
