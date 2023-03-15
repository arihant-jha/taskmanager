const express = require('express');
const Task = require('../models/Task');
const TaskList = require('../models/TaskList');

const router = express.Router();

router.get('/', async (req, res) => {
  const { taskName, description, dueDate, period, periodType, taskListId } = req.body;
  try {
    // Validate task list ID
    const taskList = await TaskList.findById(taskListId);
    if (!taskList) {
      return res.status(400).json({ error: 'Task list not found' });
    }

    // Validate period format and calculate end date
    let periodRegex;
    switch (periodType) {
      case 'monthly':
        periodRegex = /^[a-zA-Z]{3} \d{4}$/;
        break;
      case 'quarterly':
        periodRegex = /^Q[1-4] \d{4}$/;



        case 'yearly':
            periodRegex = /^\d{4}$/;
            break;
            default:
            return res.status(400).json({ error: 'Invalid period type' });
        }
        
        if (!periodRegex.test(period)) {
            return res.status(400).json({ error: `Invalid ${periodType} period format` });
        }
        
        const [periodStartMonth, periodStartYear] = period.split(' ');
        const periodStartDate = new Date(`${periodStartMonth} 1, ${periodStartYear}`);
        const periodEndDate = new Date(periodStartDate.getFullYear(), periodStartDate.getMonth() + 1, 0);
        
        // Validate due date
        const dueDateISO = new Date(dueDate.split('-').reverse().join('-')).toISOString();
        if (new Date(dueDateISO) < periodEndDate) {
            return res.status(400).json({ error: 'Due date should be after end of period' });
        }
        
        const task = new Task({
            taskName,
            description,
            dueDate: dueDateISO,
            period,
            periodType,
            taskListId,
        });
        
        const savedTask = await task.save();
        res.status(201).json({
            id: savedTask._id,
            taskName: savedTask.taskName,
            description: savedTask.description,
            dueDate: savedTask.dueDate.toLocaleDateString('en-IN'),
            period: savedTask.period,
            periodType: savedTask.periodType,
            taskListName: taskList.name,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
        }
        });
        
        module.exports = router;
        
        
