const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const TaskList = require('../models/TaskList');
const moment = require('moment');
const getPeriodEnd = require('../helper/getPeriodEnd')
const getDateFormat = require('../helper/getDateFormat')

router.post('/', async (req, res) => {
  const { taskName, description, dueDate, period, periodType, taskListId } = req.body;
  const convertedDueDate = getDateFormat(dueDate);
  const periodEnd = getPeriodEnd(periodType, period);
  
  try {
      const task = new Task({
      taskName,
      description,
      dueDate: convertedDueDate,
      period,
      periodType,
      taskListId
      });
  
      // Check if due date is after end of period
      if (convertedDueDate > periodEnd) {
      return res.status(400).json({ msg: 'Due date should be after end of period' });
      }
  
      await task.save();
      res.json(task);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
  }
  });


module.exports = router;
