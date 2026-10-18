const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from server/.env
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB database
connectDB();

const server = app.listen(PORT, () => {
  console.log(`======================================================`);
  console.log(` Student Task and Deadline Management System API`);
  console.log(` Server running in [${process.env.NODE_ENV || 'development'}] mode on port ${PORT}`);
  console.log(` Health check available at: http://localhost:${PORT}/api/health`);
  console.log(`======================================================`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  // In production we would close server, but in dev keep open
});

module.exports = server;
