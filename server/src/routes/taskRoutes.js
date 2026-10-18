const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTaskStats,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { taskValidationRules, validate } = require('../middleware/validator');

// All task routes require authentication
router.use(protect);

// Task collection routes
router.get('/', getTasks);
router.get('/stats', getTaskStats);
router.post('/', taskValidationRules, validate, createTask);

// Individual task routes
router.get('/:id', getTaskById);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
