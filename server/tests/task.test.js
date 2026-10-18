const request = require('supertest');
const app = require('../src/app');
const { connectTestDB, closeTestDB, clearTestDB } = require('./setup');

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await closeTestDB();
});

afterEach(async () => {
  await clearTestDB();
});

describe('Task Management API Endpoints & Ownership Security', () => {
  let user1Token;
  let user2Token;
  let user1Id;
  let user2Id;

  beforeEach(async () => {
    // Register Student 1
    const res1 = await request(app).post('/api/auth/register').send({
      name: 'Student One',
      email: 'student1@college.edu',
      password: 'Password123!',
      studentId: 'CS-001',
    });
    user1Token = res1.body.token;
    user1Id = res1.body.user._id;

    // Register Student 2
    const res2 = await request(app).post('/api/auth/register').send({
      name: 'Student Two',
      email: 'student2@college.edu',
      password: 'Password123!',
      studentId: 'CS-002',
    });
    user2Token = res2.body.token;
    user2Id = res2.body.user._id;
  });

  describe('POST /api/tasks', () => {
    it('should create a task successfully for the authenticated student', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          title: 'Complete Algorithms Assignment 3',
          subject: 'Design & Analysis of Algorithms',
          dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
          priority: 'high',
          description: 'Implement Dijkstra and Bellman-Ford algorithms in Python.',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.task).toHaveProperty('title', 'Complete Algorithms Assignment 3');
      expect(res.body.task.status).toBe('pending');
      expect(res.body.task.user.toString()).toBe(user1Id.toString());
    });

    it('should reject task creation with missing required fields', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          description: 'Missing title, subject and dueDate',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Strict Task Ownership Isolation', () => {
    it('should guarantee that Student 2 cannot access, update, or delete Student 1 task', async () => {
      // Student 1 creates a task
      const createRes = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          title: 'Student 1 Private Capstone Draft',
          subject: 'Capstone Project',
          dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
          priority: 'high',
        });
      const task1Id = createRes.body.task._id;

      // Student 2 creates their own task
      const createRes2 = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${user2Token}`)
        .send({
          title: 'Student 2 Database Lab',
          subject: 'Database Systems',
          dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
          priority: 'medium',
        });

      // 1. Student 2 gets task list -> must only see Student 2's task, NEVER Student 1's task!
      const listRes = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${user2Token}`);

      expect(listRes.statusCode).toBe(200);
      expect(listRes.body.tasks.length).toBe(1);
      expect(listRes.body.tasks[0].title).toBe('Student 2 Database Lab');

      // 2. Student 2 tries to GET Student 1's task by ID -> must return 404 (or unauthorized)
      const getSingleRes = await request(app)
        .get(`/api/tasks/${task1Id}`)
        .set('Authorization', `Bearer ${user2Token}`);
      expect(getSingleRes.statusCode).toBe(404);

      // 3. Student 2 tries to MODIFY Student 1's task -> must return 404
      const patchRes = await request(app)
        .patch(`/api/tasks/${task1Id}`)
        .set('Authorization', `Bearer ${user2Token}`)
        .send({ title: 'Hacked by Student 2' });
      expect(patchRes.statusCode).toBe(404);

      // 4. Student 2 tries to DELETE Student 1's task -> must return 404
      const deleteRes = await request(app)
        .delete(`/api/tasks/${task1Id}`)
        .set('Authorization', `Bearer ${user2Token}`);
      expect(deleteRes.statusCode).toBe(404);

      // Verify Student 1's task remains intact
      const verifyRes = await request(app)
        .get(`/api/tasks/${task1Id}`)
        .set('Authorization', `Bearer ${user1Token}`);
      expect(verifyRes.statusCode).toBe(200);
      expect(verifyRes.body.task.title).toBe('Student 1 Private Capstone Draft');
    });
  });

  describe('Task Status Updates & Dashboard Metrics', () => {
    it('should correctly update task completion and calculate dashboard statistics', async () => {
      // Create pending task due in 2 days (upcoming)
      await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          title: 'Upcoming Math Assignment',
          subject: 'Discrete Mathematics',
          dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
          priority: 'medium',
        });

      // Create an overdue task (due yesterday)
      await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          title: 'Overdue History Essay',
          subject: 'Modern World History',
          dueDate: new Date(Date.now() - 86400000 * 2).toISOString(),
          priority: 'high',
        });

      // Create a completed task
      const completedTaskRes = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          title: 'Completed Physics Lab',
          subject: 'Applied Physics',
          dueDate: new Date(Date.now() + 86400000 * 4).toISOString(),
          priority: 'low',
        });

      // Mark physics lab as completed
      await request(app)
        .patch(`/api/tasks/${completedTaskRes.body.task._id}`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send({ status: 'completed' });

      // Fetch dashboard metrics
      const statsRes = await request(app)
        .get('/api/tasks/stats')
        .set('Authorization', `Bearer ${user1Token}`);

      expect(statsRes.statusCode).toBe(200);
      expect(statsRes.body.stats.total).toBe(3);
      expect(statsRes.body.stats.completed).toBe(1);
      expect(statsRes.body.stats.pending).toBe(2);
      expect(statsRes.body.stats.overdue).toBe(1);
      expect(statsRes.body.stats.upcoming).toBe(1);
      expect(statsRes.body.stats.completionRate).toBe(33); // 1 out of 3 = 33%
    });

    it('should delete task and update count accordingly', async () => {
      const taskRes = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          title: 'Task to be deleted',
          subject: 'Elective Course',
          dueDate: new Date(Date.now() + 86400000).toISOString(),
        });

      const taskId = taskRes.body.task._id;

      // Delete task
      const delRes = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${user1Token}`);

      expect(delRes.statusCode).toBe(200);
      expect(delRes.body.success).toBe(true);

      // Verify it cannot be retrieved
      const getRes = await request(app)
        .get(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${user1Token}`);
      expect(getRes.statusCode).toBe(404);
    });
  });
});
