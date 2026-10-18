const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/student_task_manager');
    console.log(`[Database] MongoDB Connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] Failed to connect to MongoDB: ${error.message}`);
    console.error(`[Database Tip] Make sure your MongoDB service is running locally, or configure MONGODB_URI in server/.env with your MongoDB Atlas connection string.`);
    if (process.env.NODE_ENV !== 'test') {
      // Allow the server process to continue running so health checks or dev fallback can advise the developer
      console.warn('[Database Warning] Continuing in disconnected state until MongoDB is available.');
    }
    return null;
  }
};

module.exports = connectDB;
