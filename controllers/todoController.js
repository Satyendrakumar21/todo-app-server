const Todo = require('../models/Todo');

exports.createTodo = async (req, res) => {
  try {
    const todo = new Todo({
      ...req.body,
      user: req.userId
    });
    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getTodos = async (req, res) => {
  try {
    const { status, sort, search } = req.query;
    let query = { user: req.userId };
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption = {};
    switch (sort) {
      case 'date':
        sortOption.dueDate = 1;
        break;
      case 'priority':
        sortOption.priority = -1;
        break;
      case 'title':
        sortOption.title = 1;
        break;
      default:
        sortOption.createdAt = -1;
    }

    const todos = await Todo.find(query).sort(sortOption);
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTodo = async (req, res) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.userId
    });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json(todo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json({ message: 'Todo deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 