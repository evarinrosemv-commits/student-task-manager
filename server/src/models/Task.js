const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task must belong to an authenticated student user'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a task or assignment title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    subject: {
      type: String,
      required: [true, 'Please provide a course or subject name'],
      trim: true,
      maxlength: [80, 'Subject name cannot exceed 80 characters'],
    },
    dueDate: {
      type: Date,
      required: [true, 'Please provide a valid due date and time'],
    },
    priority: {
      type: String,
      required: true,
      enum: {
        values: ['low', 'medium', 'high'],
        message: 'Priority must be either low, medium, or high',
      },
      default: 'medium',
      lowercase: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ['pending', 'completed'],
        message: 'Status must be either pending or completed',
      },
      default: 'pending',
      lowercase: true,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual property to calculate whether task is overdue
taskSchema.virtual('isOverdue').get(function () {
  if (this.status === 'completed') return false;
  return new Date(this.dueDate) < new Date();
});

// Composite index for fast queries filtered by user, status, and sorted by dueDate
taskSchema.index({ user: 1, status: 1, dueDate: 1 });
taskSchema.index({ user: 1, priority: 1 });
taskSchema.index({ user: 1, subject: 1 });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
