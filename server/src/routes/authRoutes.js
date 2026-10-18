const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const {
  registerValidationRules,
  loginValidationRules,
  validate,
} = require('../middleware/validator');

// Public authentication routes
router.post('/register', registerValidationRules, validate, register);
router.post('/login', loginValidationRules, validate, login);

// Protected account routes
router.get('/me', protect, getMe);
router.patch('/profile', protect, updateProfile);

module.exports = router;
