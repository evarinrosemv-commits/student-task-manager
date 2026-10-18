const { body, validationResult } = require('express-validator');

// Middleware to evaluate validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }
  next();
};

// Validation rules for registration
const registerValidationRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('studentId')
    .optional()
    .trim(),
  body('department')
    .optional()
    .trim(),
];

// Validation rules for login
const loginValidationRules = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Validation rules for task creation and updating
const taskValidationRules = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Task title is required')
    .isLength({ max: 120 })
    .withMessage('Task title cannot exceed 120 characters'),
  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject or course name is required')
    .isLength({ max: 80 })
    .withMessage('Subject name cannot exceed 80 characters'),
  body('dueDate')
    .notEmpty()
    .withMessage('Due date is required')
    .isISO8601()
    .withMessage('Please provide a valid ISO date for dueDate'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('status')
    .optional()
    .isIn(['pending', 'completed'])
    .withMessage('Status must be pending or completed'),
];

module.exports = {
  validate,
  registerValidationRules,
  loginValidationRules,
  taskValidationRules,
};
