const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectTestDB = async () => {
  try {
    // Attempt in-memory MongoDB first for 100% test isolation and zero dependencies
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  } catch (err) {
    console.warn('[Test DB Warning] MongoMemoryServer startup fallback, connecting to local test URI:', err.message);
    const fallbackUri = process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/student_task_manager_test';
    await mongoose.connect(fallbackUri);
  }
};

const closeTestDB = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  } catch (err) {
    console.error('Error closing test database:', err.message);
  }
};

const clearTestDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
};

module.exports = {
  connectTestDB,
  closeTestDB,
  clearTestDB,
};
