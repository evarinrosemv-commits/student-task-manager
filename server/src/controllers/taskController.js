const Task = require('../models/Task');

// @desc    Get all tasks for the logged-in student with filters, search, and sorting
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const { status, priority, subject, search, sort } = req.query;

    // Strict ownership filter: strictly for the authenticated student user
    const query = { user: req.user._id };

    // Status filter
    if (status) {
      if (status === 'overdue') {
        query.status = 'pending';
        query.dueDate = { $lt: new Date() };
      } else if (status === 'pending' || status === 'completed') {
        query.status = status;
      }
    }

    // Priority filter
    if (priority && ['low', 'medium', 'high'].includes(priority.toLowerCase())) {
      query.priority = priority.toLowerCase();
    }

    // Subject filter
    if (subject && subject.trim() !== '' && subject.toLowerCase() !== 'all') {
      query.subject = { $regex: new RegExp(`^${subject.trim()}$`, 'i') };
    }

    // Keyword search across title, description, and subject
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { subject: searchRegex },
      ];
    }

    // Sorting configuration
    let sortOptions = { dueDate: 1 }; // Default: earliest due date first
    if (sort === 'dueDate_desc') {
      sortOptions = { dueDate: -1 };
    } else if (sort === 'createdAt_desc') {
      sortOptions = { createdAt: -1 };
    } else if (sort === 'createdAt_asc') {
      sortOptions = { createdAt: 1 };
    } else if (sort === 'title_asc') {
      sortOptions = { title: 1 };
    }

    const tasks = await Task.find(query).sort(sortOptions);

    // If sorting by priority, do a secondary sort in memory for clean low/medium/high ranking
    if (sort === 'priority_desc' || sort === 'priority_asc') {
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      tasks.sort((a, b) => {
        const weightA = priorityWeight[a.priority] || 0;
        const weightB = priorityWeight[b.priority] || 0;
        return sort === 'priority_desc' ? weightB - weightA : weightA - weightB;
      });
    }

    // Distinct list of subjects for student convenience in filter dropdowns
    const distinctSubjects = await Task.distinct('subject', { user: req.user._id });

    res.status(200).json({
      success: true,
      count: tasks.length,
      subjects: distinctSubjects,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard metrics and statistics for the authenticated student
// @route   GET /api/tasks/stats
// @access  Private
const getTaskStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(now.getDate() + 7);

    // Fetch all tasks for the student to calculate metrics
    const userTasks = await Task.find({ user: userId });

    const total = userTasks.length;
    let completed = 0;
    let pending = 0;
    let overdue = 0;
    let upcoming = 0;
    const priorityCounts = { high: 0, medium: 0, low: 0 };

    userTasks.forEach((task) => {
      // Priority count
      if (priorityCounts[task.priority] !== undefined) {
        priorityCounts[task.priority]++;
      }

      if (task.status === 'completed') {
        completed++;
      } else {
        pending++;
        const taskDueDate = new Date(task.dueDate);
        if (taskDueDate < now) {
          overdue++;
        } else if (taskDueDate <= sevenDaysFromNow) {
          upcoming++;
        }
      }
    });

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Fetch up to 5 most urgent upcoming pending tasks for the dashboard
    const upcomingDeadlines = await Task.find({
      user: userId,
      status: 'pending',
      dueDate: { $gte: now },
    })
      .sort({ dueDate: 1 })
      .limit(5);

    // Fetch up to 5 most recently created or updated tasks
    const recentTasks = await Task.find({ user: userId })
      .sort({ updatedAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        total,
        pending,
        completed,
        overdue,
        upcoming,
        completionRate,
        priorityCounts,
      },
      upcomingDeadlines,
      recentTasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or you do not have permission to access it.',
      });
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, subject, dueDate, priority, status } = req.body;

    const task = await Task.create({
      user: req.user._id,
      title: title.trim(),
      description: description ? description.trim() : '',
      subject: subject.trim(),
      dueDate: new Date(dueDate),
      priority: priority ? priority.toLowerCase() : 'medium',
      status: status ? status.toLowerCase() : 'pending',
      completedAt: status === 'completed' ? new Date() : null,
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully.',
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing task
// @route   PATCH /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const { title, description, subject, dueDate, priority, status } = req.body;

    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or you do not have permission to modify it.',
      });
    }

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (subject !== undefined) task.subject = subject.trim();
    if (dueDate !== undefined) task.dueDate = new Date(dueDate);
    if (priority !== undefined) task.priority = priority.toLowerCase();
    
    if (status !== undefined) {
      const normalizedStatus = status.toLowerCase();
      if (normalizedStatus === 'completed' && task.status !== 'completed') {
        task.completedAt = new Date();
      } else if (normalizedStatus === 'pending') {
        task.completedAt = null;
      }
      task.status = normalizedStatus;
    }

    await task.save();

    res.status(200).json({
      success: true,
      message: 'Task updated successfully.',
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or you do not have permission to delete it.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully.',
      id: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTaskStats,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
