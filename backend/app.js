const express = require('express');
const bodyParser = require('body-parser');
const {db} = require('./db/db')
require('dotenv').config()
const cors = require('cors');
const port = 5000
const getDateFormat = require('./helper/getDateFormat');
const getPeriodEnd = require('./helper/getPeriodEnd');

const app = express();
app.use(bodyParser.json());
app.use(cors());
db();

const TaskList = require('./models/TaskList')
const Task = require('./models/Task')

//for debuging
// async function getTasks() {
//     const Tasks = await Task.find()
//     console.log(Tasks)
//     // return TaskLists
//     Tasks.map((task) => {
//       const taskListId = task.taskListId;
//       console.log(taskListId)
//       TaskList.findById(taskListId).then(foundList => {
//         console.log(foundList.name);
//         // console.log(typeof foundList.name);
//       })
//     })
//     // Task.find().populate('taskListId')
//     // const taskListName = Task.taskListId.name;
//     // console.log(taskListName)
// }
// getTasks()

// Create task list API
app.post('/api/createtasklist', async (req, res) => {
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


app.post('/api/createtask', async (req, res) => {
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
    if (convertedDueDate >= periodEnd) {
    return res.status(400).json({ msg: 'Due date should be after end of period' });
    }

    await task.save();
    res.json(task);
} catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
}
});


  

// List task API
app.get('/api/tasklist', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const searchText = req.query.searchText;
    const searchRegex = searchText ? new RegExp(searchText, 'i') : null;
    
    let filter = {};
    if (searchRegex) {
      filter = {
        $or: [
          { taskName: searchRegex },
          { description: searchRegex }
        ]
      };
    }

    const tasks = await Task.find(filter)
      .populate({ path: 'taskList', select: 'name' })
      .sort({ dueDate: 1 })
      .skip((page - 1) * limit)
      .limit(limit);
    const count = await Task.countDocuments(filter);

    async function getListName(id){
      try {
        const foundList = await TaskList.findById(id);
        console.log(foundList.name);
        return foundList.name;
      } catch (error) {
        console.error(error);
        return "TaskList unnamed";
      }
    }
    
    const formattedTasks = await Promise.all(tasks.map(async (task) => ({
      taskId: task._id,
      taskName: task.taskName,
      description: task.description,
      periodType: task.periodType,
      period: task.period,
      dueDate: task.dueDate,
      taskListName: await getListName(task.taskListId)
    })));

    res.json({
      totalTasks: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      tasks: formattedTasks
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Delete task API
app.delete('/api/task/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({ msg: 'Task not found' });
    }
    res.json({ msg: 'Task deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//Update Task API
app.put('/api/task/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    const { taskName, description, dueDate, period, periodType, taskListId } = req.body;
    if (taskName) task.taskName = taskName;
    if (description) task.description = description;
    if (dueDate) task.dueDate = getDateFormat(dueDate);
    if (period) task.period = period;
    if (periodType) task.periodType = periodType;
    if (taskListId) task.taskListId = taskListId;

    const periodEnd = getPeriodEnd(task.periodType, task.period);
    if (task.dueDate > periodEnd) {
      return res.status(400).json({ msg: 'Due date should be after end of period' });
    }

    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});




app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});