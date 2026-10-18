const mongoose = require('mongoose');

// Seed realistic demo assignments if starting on an empty development database
const seedDemoData = async () => {
  try {
    const User = require('../models/User');
    const Task = require('../models/Task');
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const student = await User.create({
        name: 'Alex Morgan',
        email: 'alex.morgan@college.edu',
        password: 'Password123!',
        studentId: 'CS2026-089',
        department: 'Computer Science & Engineering',
      });

      const now = new Date();
      const days = (n) => 86400000 * n;

      await Task.create([
        {
          user: student._id,
          title: 'Data Structures: Red-Black Tree Implementation',
          subject: 'Data Structures & Algorithms',
          dueDate: new Date(now.getTime() + days(2)),
          priority: 'high',
          status: 'pending',
          description: 'Implement insertion and left/right rotation methods in C++ with unit tests.',
        },
        {
          user: student._id,
          title: 'Operating Systems: Concurrency & Semaphores Lab',
          subject: 'Operating Systems',
          dueDate: new Date(now.getTime() + days(4)),
          priority: 'high',
          status: 'pending',
          description: 'Solve the producer-consumer and dining philosophers problem using POSIX mutexes.',
        },
        {
          user: student._id,
          title: 'Database Systems: SQL Normalization Assignment',
          subject: 'Database Systems',
          dueDate: new Date(now.getTime() + days(6)),
          priority: 'medium',
          status: 'pending',
          description: 'Decompose relation schemas into BCNF and 3NF with functional dependency proofs.',
        },
        {
          user: student._id,
          title: 'Computer Networks: Socket Programming Lab Report',
          subject: 'Computer Networks',
          dueDate: new Date(now.getTime() - days(2)), // Overdue
          priority: 'high',
          status: 'pending',
          description: 'TCP multi-threaded server documentation with Wireshark packet capture analysis.',
        },
        {
          user: student._id,
          title: 'Software Engineering: SRS & Architecture Diagram',
          subject: 'Software Engineering',
          dueDate: new Date(now.getTime() - days(4)),
          priority: 'medium',
          status: 'completed',
          completedAt: new Date(now.getTime() - days(3)),
          description: 'Submit comprehensive IEEE-830 SRS document with Level-1 DFD and UML diagrams.',
        },
      ]);
      console.log('[Database] Pre-loaded demo student account: alex.morgan@college.edu (Password: Password123!)');
    }
  } catch (seedErr) {
    console.warn('[Database] Demo seed note:', seedErr.message);
  }
};

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/student_task_manager';

  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
    console.log(`[Database] MongoDB Connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    // If local MongoDB service is not running on localhost, automatically spin up development database
    if (uri.includes('localhost') || uri.includes('127.0.0.1')) {
      try {
        console.log('[Database Notice] Local MongoDB service was not detected on localhost:27017.');
        console.log('[Database Notice] Starting built-in development database so you can test immediately...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create();
        const memUri = mongoServer.getUri();
        const conn = await mongoose.connect(memUri);
        console.log('[Database] Built-in development database is ONLINE and ready.');
        await seedDemoData();
        return conn;
      } catch (fallbackError) {
        console.error('[Database Error] Failed to launch built-in fallback database:', fallbackError.message);
      }
    }

    console.error(`[Database Error] Failed to connect to MongoDB: ${error.message}`);
    console.error(`[Database Tip] Make sure your MongoDB service is running, or set MONGODB_URI in server/.env with your MongoDB Atlas connection string.`);
    return null;
  }
};

module.exports = connectDB;
