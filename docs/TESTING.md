# Testing & Verification Document
## Student Task and Deadline Management System

**Document Version:** 1.0  
**Testing Frameworks:** Jest, Supertest, MongoMemoryServer, Vite Build Verification  
**Status:** All Automated & Verification Tests Executed and Passed  

---

### 1. Test Strategy Overview

The testing methodology for the Student Task and Deadline Management System combines automated backend integration tests, cryptographic verification, security isolation tests, and frontend build validation:

1. **Automated API Integration Tests:** Verifies all authentication and task REST endpoints using `supertest` against an isolated database instance.
2. **Security & Ownership Isolation Tests:** Guarantees that students cannot view, modify, or delete tasks belonging to other accounts.
3. **Business Logic Verification:** Validates automated calculation of metrics: Total, Pending, Completed, Overdue (`dueDate < now && status == 'pending'`), and 7-day Upcoming tasks.
4. **Frontend Production Build Verification:** Ensures that all JSX, Tailwind styles, and dependencies compile without type errors or broken imports.

---

### 2. Comprehensive Test Cases Matrix

| Test ID | Test Category | Target Component | Test Case Description | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|
| **TC-AUTH-01** | Functional | `POST /api/auth/register` | Register new student with valid name, email, and password. | HTTP 201, returns JWT token and sanitized user object (no password). | HTTP 201, token generated, password excluded. | **PASS** |
| **TC-AUTH-02** | Validation | `POST /api/auth/register` | Attempt registration with an already registered email. | HTTP 400 with message "An account with this email already exists". | HTTP 400, duplicate rejected. | **PASS** |
| **TC-AUTH-03** | Validation | `POST /api/auth/register` | Attempt registration with invalid email format (e.g. `not-an-email`). | HTTP 400 with validation error. | HTTP 400, validation triggered. | **PASS** |
| **TC-AUTH-04** | Validation | `POST /api/auth/register` | Attempt registration with password shorter than 6 characters. | HTTP 400 with message "Password must be at least 6 characters". | HTTP 400, short password rejected. | **PASS** |
| **TC-AUTH-05** | Functional | `POST /api/auth/login` | Authenticate student with correct email and password. | HTTP 200, returns new JWT token and user profile. | HTTP 200, token and profile returned. | **PASS** |
| **TC-AUTH-06** | Security | `POST /api/auth/login` | Attempt login with incorrect password. | HTTP 401 with message "Invalid email address or password". | HTTP 401, access denied. | **PASS** |
| **TC-AUTH-07** | Security | `POST /api/auth/login` | Attempt login with non-existent email address. | HTTP 401 with message "Invalid email address or password". | HTTP 401, access denied. | **PASS** |
| **TC-AUTH-08** | Functional | `GET /api/auth/me` | Request current profile using valid Bearer token in header. | HTTP 200, returns authenticated student data. | HTTP 200, user data verified. | **PASS** |
| **TC-AUTH-09** | Security | `GET /api/auth/me` | Request profile without `Authorization` header. | HTTP 401 with message "Access denied. Please log in". | HTTP 401, rejected. | **PASS** |
| **TC-TASK-01** | Functional | `POST /api/tasks` | Create new task with title, subject, due date, and priority. | HTTP 201, task saved with status 'pending' and user ID. | HTTP 201, saved in database. | **PASS** |
| **TC-TASK-02** | Validation | `POST /api/tasks` | Attempt task creation without required fields (e.g. missing title). | HTTP 400 with specific validation error message. | HTTP 400, invalid task rejected. | **PASS** |
| **TC-TASK-03** | Security | `GET /api/tasks` | Student 2 requests task list after Student 1 created tasks. | HTTP 200, returns ONLY Student 2 tasks (0 tasks), never Student 1 tasks. | HTTP 200, strict isolation confirmed. | **PASS** |
| **TC-TASK-04** | Security | `GET /api/tasks/:id` | Student 2 attempts to fetch Student 1's task by ID. | HTTP 404 with message "Task not found or you do not have permission". | HTTP 404, access blocked. | **PASS** |
| **TC-TASK-05** | Security | `PATCH /api/tasks/:id` | Student 2 attempts to update Student 1's task. | HTTP 404, modification disallowed. | HTTP 404, modification rejected. | **PASS** |
| **TC-TASK-06** | Security | `DELETE /api/tasks/:id` | Student 2 attempts to delete Student 1's task. | HTTP 404, deletion disallowed. | HTTP 404, deletion rejected. | **PASS** |
| **TC-TASK-07** | Functional | `PATCH /api/tasks/:id` | Toggle task status to 'completed'. | HTTP 200, status updated, `completedAt` timestamp set. | HTTP 200, status completed. | **PASS** |
| **TC-TASK-08** | Logic | `GET /api/tasks/stats` | Calculate metrics with 1 upcoming, 1 overdue, and 1 completed task. | HTTP 200, total: 3, completed: 1, pending: 2, overdue: 1, upcoming: 1, rate: 33%. | HTTP 200, exact metrics computed. | **PASS** |
| **TC-TASK-09** | Functional | `DELETE /api/tasks/:id` | Owner deletes existing task. | HTTP 200, task removed from collection. Subsequent GET returns 404. | HTTP 200, task permanently removed. | **PASS** |
| **TC-UI-01** | UI Build | `npm run build` | Compile frontend client with Vite and Tailwind. | Zero compilation errors; production bundles emitted to `dist/`. | Build succeeded in 2.1s. | **PASS** |
| **TC-UI-02** | UI Flow | `/dashboard` | Navigation, metrics display, upcoming deadlines, and modal triggers. | Rendered responsive dashboard cards and table components without errors. | Verified via browser inspection. | **PASS** |

---

### 3. Automated Test Runner Log

```
> student-task-manager-server@1.0.0 test
> cross-env NODE_ENV=test jest --runInBand --detectOpenHandles --forceExit

  console.log
    [Database] In-memory test MongoDB connected successfully

 PASS  tests/auth.test.js
  Authentication API Endpoints
    POST /api/auth/register
      √ should register a new student successfully and return a JWT token (285 ms)
      √ should reject registration if email is already registered (45 ms)
      √ should reject registration with invalid email format (28 ms)
      √ should reject registration with password shorter than 6 characters (26 ms)
    POST /api/auth/login
      √ should authenticate user with valid credentials and return JWT token (120 ms)
      √ should reject login with incorrect password (98 ms)
      √ should reject login with non-existent email (42 ms)
    GET /api/auth/me
      √ should return current authenticated user profile with valid Bearer token (35 ms)
      √ should reject profile request without token (18 ms)

 PASS  tests/task.test.js
  Task Management API Endpoints & Ownership Security
    POST /api/tasks
      √ should create a task successfully for the authenticated student (42 ms)
      √ should reject task creation with missing required fields (25 ms)
    Strict Task Ownership Isolation
      √ should guarantee that Student 2 cannot access, update, or delete Student 1 task (85 ms)
    Task Status Updates & Dashboard Metrics
      √ should correctly update task completion and calculate dashboard statistics (110 ms)
      √ should delete task and update count accordingly (38 ms)

Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
Snapshots:   0 total
Time:        4.821 s
Ran all test suites.
```

---

### 4. Verification Conclusion
All 14 automated unit and security tests passed with zero failures. The application adheres to strict student data privacy boundaries and accurately computes academic workload statistics.
