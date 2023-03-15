const router = require('express').Router();
const TaskList = require('../models/TaskList.js');

// Get all task lists
router.route('/').get((req, res) => {
  TaskList.find()
    .then(taskLists => res.json(taskLists))
    .catch(err => res.status(400).json('Error: ' + err));
});

// router.route('/').get((req, res) => {
//     res.send('this is it');
// })

router.route('/').get((req, res) => {
    try {
      const { page = 1, pageSize = 10, searchText } = req.query;
      const skip = (page - 1) * pageSize;
  
      let query = Task.find()
        .populate('taskList', 'name')
        .skip(skip)
        .limit(pageSize);
  
      if (searchText) {
        query = query.find({
          $or: [
            { taskName: { $regex: searchText, $options: 'i' } },
            { description: { $regex: searchText, $options: 'i' } },
          ],
        });
      }
  
      const tasks =  query.exec();
      const count =  Task.countDocuments().exec();
  
      res.json({ count, tasks });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  })
  


// // Create new task list
// router.route('/add').post((req, res) => {
//   const title = req.body.title;

//   const newTaskList = new TaskList({
//     title,
//   });

//   newTaskList.save()
//     .then(() => res.json('Task list added!'))
//     .catch(err => res.status(400).json('Error: ' + err));
// });

module.exports = router;