const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const auth = require('../middleware/auth');

// All routes are protected with auth middleware
router.use(auth);

router.post('/', todoController.createTodo);
router.get('/', todoController.getTodos);
router.get('/:id', todoController.getTodo);
router.put('/:id', todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);

module.exports = router; 