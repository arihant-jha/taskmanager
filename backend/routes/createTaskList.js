const express = require('express');
const router = express.Router();
const TaskList = require('../models/TaskList');

// Create Task List

router.post('/', async (req, res) => {
  try {
    const taskList = new TaskList({
      name: req.body.name,
      description: req.body.description,
      active: req.body.active ?? true,
    });
    await taskList.save();
    res.json({
      id: taskList._id,
      name: taskList.name,
      description: taskList.description,
      active: taskList.active,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
