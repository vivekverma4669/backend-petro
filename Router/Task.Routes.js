express= require('express');
const TaskRouter = express.Router();
const TaskModel = require('../models/Task.module');
// const UserModel = require('../models/User.module');
TaskRouter.use(express.json());


TaskRouter.get('/', async (req,res)=>{
  const userId = req.headers.userId;

  try {
      const { page = 1, limit = 10, completed } = req.query;
      const filter = { user_id: userId };

      if (completed !== undefined) {
          filter.completed = completed;
      }

      const sortCriteria = { due_date: 1 };

      const tasks = await TaskModel.find(filter)
          .sort(sortCriteria)
          .limit(limit * 1)
          .skip((page - 1) * limit)
          .exec();

      const totalCount = await TaskModel.countDocuments(filter);

      res.json({
          tasks,
          totalPages: Math.ceil(totalCount / limit),
          currentPage: page
      });
  }
  catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
});



TaskRouter.post('/create', async (req, res) => {
  const { title, content, due_date ,completed } = req.body;
  const userId = req.headers.userId; 
  try {
    const Task = await TaskModel.create({ title, content,  due_date , completed , user_id: userId });
    res.status(201).json({ msg: 'Task created successfully', Task });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});


TaskRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const Task = await TaskModel.find({_id : id});
      if (!Task) {
          return res.status(404).json({ message: 'Task not found' });
      }
      res.json(Task);
  }
  catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
});



TaskRouter.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content , due_date , completed } = req.body;

  try {
      const updatedTask = await TaskModel.findByIdAndUpdate(id, { title, content , due_date , completed}, { new: true });

      if (!updatedTask) {
          return res.status(404).json({ message: 'Task not found' });
      }

      res.json({ message: 'Task updated successfully', Task: updatedTask });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
});



TaskRouter.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const deletedTask = await TaskModel.findByIdAndDelete(id);

      if (!deletedTask) {
          return res.status(404).json({ message: 'Task not found' });
      }
      res.json({ message: 'Task deleted successfully', Task: deletedTask });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
});


module.exports = TaskRouter;
