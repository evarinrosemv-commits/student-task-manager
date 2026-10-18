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

describe('Authentication API Endpoints', () => {
  const sampleUser = {
    name: 'Aarav Sharma',
    email: 'aarav.sharma@college.edu',
    password: 'Password123!',
    studentId: 'CS2026-042',
    department: 'Computer Science',
  };

  describe('POST /api/auth/register', () => {
    it('should register a new student successfully and return a JWT token', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(sampleUser);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('name', sampleUser.name);
      expect(res.body.user).toHaveProperty('email', sampleUser.email);
      expect(res.body.user).not.toHaveProperty('password');
    });

    it('should reject registration if email is already registered', async () => {
      await request(app).post('/api/auth/register').send(sampleUser);

      const res = await request(app)
        .post('/api/auth/register')
        .send(sampleUser);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/already exists/i);
    });

    it('should reject registration with invalid email format', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ ...sampleUser, email: 'not-an-email' });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject registration with password shorter than 6 characters', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ ...sampleUser, password: '123' });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send(sampleUser);
    });

    it('should authenticate user with valid credentials and return JWT token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: sampleUser.email,
          password: sampleUser.password,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', sampleUser.email);
    });

    it('should reject login with incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: sampleUser.email,
          password: 'WrongPassword!',
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject login with non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'unknown.student@college.edu',
          password: sampleUser.password,
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return current authenticated user profile with valid Bearer token', async () => {
      const regRes = await request(app)
        .post('/api/auth/register')
        .send(sampleUser);
      const token = regRes.body.token;

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.email).toBe(sampleUser.email);
    });

    it('should reject profile request without token', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
