const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to sign JWT token
const generateToken = (userId, email) => {
  return jwt.sign(
    { id: userId, email },
    process.env.JWT_SECRET || 'student_task_manager_super_secure_jwt_secret_key_2026',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, studentId, department } = req.body;

    // Check if student with email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A student account with this email address already exists. Please log in instead.',
      });
    }

    // Create student user record
    const user = await User.create({
      name,
      email,
      password,
      studentId: studentId || '',
      department: department || '',
    });

    const token = generateToken(user._id, user.email);

    res.status(201).json({
      success: true,
      message: 'Student account registered successfully.',
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate student and get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check for student user including hidden password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email address or password. Please verify your credentials.',
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email address or password. Please verify your credentials.',
      });
    }

    const token = generateToken(user._id, user.email);

    res.status(200).json({
      success: true,
      message: 'Login successful. Welcome back!',
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get currently authenticated student profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

// @desc    Update student profile details
// @route   PATCH /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, studentId, department } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Student record not found.',
      });
    }

    if (name) user.name = name.trim();
    if (studentId !== undefined) user.studentId = studentId.trim();
    if (department !== undefined) user.department = department.trim();

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
};
