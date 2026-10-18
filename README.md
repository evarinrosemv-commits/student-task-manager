# Student Task and Deadline Management System

> **A Full-Stack MERN College Capstone Project**  
> Engineered to help students organize academic coursework, record submission deadlines, prioritize assignments, monitor pending tasks, and track completed deliverables from an intuitive, responsive dashboard.

---

## 📚 Project Overview

The **Student Task and Deadline Management System** is a complete, production-grade web application built with the **MERN** stack (**M**ongoDB, **E**xpress.js, **R**eact.js with Vite, and **N**ode.js). 

University students often juggle overlapping assignments, laboratory reports, group projects, and semester exams. This application provides a centralized, dedicated productivity tool that eliminates the cognitive clutter of general-purpose to-do lists and the complexity of enterprise project tools.

---

## ✨ Key Features

- **🔐 Student Authentication & Security**
  - Secure student registration and login with input validation.
  - Salted password hashing with `bcryptjs` (salt rounds: 10).
  - Stateless JSON Web Token (`JWT`) authentication with Bearer tokens.
  - Strict server-side ownership authorization: **each student can only access, modify, or delete their own tasks**.
  - Demo account one-click helper on the login page for effortless college viva and presentation demonstrations.

- **📊 Dynamic Student Dashboard**
  - **Total Assignments:** Total number of recorded coursework tasks.
  - **Pending Work:** Count of assignments awaiting completion.
  - **Completed Tasks:** Real-time count and percentage completion progress bar.
  - **Overdue Detection:** Automatically flags tasks whose due date has passed without completion (`dueDate < now && status !== 'completed'`).
  - **Urgent Overdue Alert Banner:** Prominent warning when overdue tasks exist, with a one-click filter shortcut.
  - **Priority Breakdown:** Visual indicator badges categorizing tasks by High, Medium, and Low priority.
  - **Upcoming Deadlines (Next 7 Days):** Displays imminent deliverables sorted chronologically.
  - **Recent Tasks:** Displays recently updated tasks with one-click completion toggling.
  - **Empty State:** Friendly guidance and quick-add call to action for students with no tasks yet.

- **📝 Comprehensive Task Management**
  - Create tasks with **Title**, **Course/Subject**, **Due Date & Time**, **Priority (Low, Medium, High)**, and optional **Notes/Description**.
  - Edit existing assignments using a pre-populated modal dialog.
  - Mark tasks as `completed` or `pending` with instant visual feedback and timestamping.
  - Delete assignments with a safe, accessible confirmation modal.
  - Keyword search across task titles, subjects, and descriptions.
  - Multi-attribute filtering by **Status** (All, Pending, Completed, Overdue), **Priority** (All, High, Medium, Low), and **Subject**.
  - Flexible sorting by **Due Date** (soonest/furthest first), **Priority** (high-to-low/low-to-high), and **Creation Date**.

- **👤 Student Profile Management**
  - View student information (Name, Email, Student/Roll ID, Academic Department).
  - Update personal academic details with real-time feedback.
  - Review semester completion statistics and overall productivity rate.

- **🎨 UI/UX Excellence**
  - Clean, modern student productivity theme with an indigo palette.
  - 100% responsive layout across mobile smartphones, tablets, and desktops.
  - Accessible form labels, clear error banners, and loading indicators.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Database** | **MongoDB** & **Mongoose** | Document database with schema validation, timestamps, and compound indexing. |
| **Backend** | **Node.js** & **Express.js** | RESTful API server, routing, JWT middleware, and centralized error handling. |
| **Frontend** | **React.js 18** with **Vite** | Fast single-page application with reactive hooks and component architecture. |
| **Styling** | **Tailwind CSS** | Responsive utility styling, cohesive design tokens, and smooth UI transitions. |
| **Icons** | **Lucide React** | Clean, modern UI iconography. |
| **HTTP Client** | **Axios** | API communication with automatic request token interceptors and 401 handling. |
| **Testing** | **Jest**, **Supertest**, **MongoMemoryServer** | Automated API integration and security isolation testing. |
| **Version Control** | **Git** & **GitHub** | Source code versioning and open collaboration. |

---

## 📁 Project Directory Structure

```text
student-task-manager/
├── client/                      # Frontend React + Vite application
│   ├── public/                  # Static assets & favicon
│   ├── src/
│   │   ├── api/                 # Axios client with JWT interceptor
│   │   ├── components/          # Reusable UI components (Navbar, Modals, Cards, Filters)
│   │   ├── context/             # AuthContext (state, login, register, logout)
│   │   ├── pages/               # Pages: Login, Register, Dashboard, Tasks, Profile, NotFound
│   │   ├── App.jsx              # Application routing & layout
│   │   ├── index.css            # Tailwind directives & badge styles
│   │   └── main.jsx             # React entry point
│   ├── index.html               # HTML5 template
│   ├── package.json             # Frontend dependencies & scripts
│   ├── tailwind.config.js       # Tailwind configuration
│   ├── vite.config.js           # Vite server & API proxy config
│   └── .env.example             # Frontend environment variables template
├── server/                      # Backend Node.js + Express REST API
│   ├── src/
│   │   ├── config/              # MongoDB connection configuration
│   │   ├── controllers/         # authController.js & taskController.js
│   │   ├── middleware/          # auth.js, errorHandler.js, validator.js
│   │   ├── models/              # User.js & Task.js (Mongoose models)
│   │   ├── routes/              # authRoutes.js & taskRoutes.js
│   │   ├── app.js               # Express application configuration
│   │   └── server.js            # Server entry point & listener
│   ├── tests/                   # Automated tests (auth.test.js, task.test.js)
│   ├── package.json             # Backend dependencies & scripts
│   └── .env.example             # Server environment variables template
├── docs/                        # Complete academic capstone documentation
│   ├── SRS.md                   # Software Requirements Specification (IEEE standard)
│   ├── PROJECT_REPORT.md        # Comprehensive Final Project Report draft
│   └── TESTING.md               # Test cases matrix & actual execution results
├── screenshots/                 # Application screenshots for college submission
├── README.md                    # This comprehensive guide
└── .gitignore                   # Excludes node_modules, .env, and dist files
```

---

## 🚀 Step-by-Step Installation & Local Setup

### Prerequisites
Before running the application, make sure you have installed on your computer:
1. **Node.js** (v18.0.0 or higher) — [Download Node.js](https://nodejs.org/)
2. **Git** — [Download Git](https://git-scm.com/)
3. **MongoDB** — Either a local MongoDB instance, or a free cloud database on [MongoDB Atlas](https://www.mongodb.com/atlas).

---

### Step 1: Clone or Navigate to the Project

Open your terminal or PowerShell and navigate to the project directory:

```bash
cd student-task-manager
```

---

### Step 2: Configure the Backend Server

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env`:
   - On Windows (PowerShell):
     ```powershell
     Copy-Item .env.example .env
     ```
   - On Linux/macOS:
     ```bash
     cp .env.example .env
     ```

4. Edit `server/.env` with your settings:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/student_task_manager
   JWT_SECRET=your_jwt_secret_key_minimum_32_characters_here
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:5173
   ```
   *(If using MongoDB Atlas, replace `MONGODB_URI` with your connection string: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/student_task_manager?retryWrites=true&w=majority`)*

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *(Or `npm start`)*

   The backend will be live at: **`http://localhost:5000`**  
   Health check endpoint: **`http://localhost:5000/api/health`**

---

### Step 3: Configure the Frontend Client

1. Open a **new terminal tab or window** and navigate to the `client` directory:
   ```bash
   cd student-task-manager/client
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (optional for local development):
   Copy `.env.example` to `.env`:
   - On Windows (PowerShell):
     ```powershell
     Copy-Item .env.example .env
     ```
   - On Linux/macOS:
     ```bash
     cp .env.example .env
     ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

   The application will be live at: **`http://localhost:5173`**

5. Open your web browser and navigate to **`http://localhost:5173`**. You will see the login page!

---

## 🧪 Running Automated Tests

The backend includes a comprehensive automated test suite testing user registration, password hashing, login authentication, task CRUD operations, dashboard calculations, and **strict per-user data isolation**.

To execute the tests:

```bash
cd server
npm test
```

All tests execute inside an isolated test database with zero side effects on your production database.

---

## 📡 REST API Reference

All requests and responses use standard JSON formatting. Protected endpoints require the header:  
`Authorization: Bearer <jwt_token>`

### Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new student account | Public |
| `POST` | `/api/auth/login` | Authenticate student & receive token | Public |
| `GET` | `/api/auth/me` | Fetch authenticated student profile | Private (Bearer Token) |
| `PATCH` | `/api/auth/profile` | Update student profile details | Private (Bearer Token) |

### Task Management Endpoints (`/api/tasks`)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/tasks` | Get all tasks (supports query filters) | Private (Bearer Token) |
| `GET` | `/api/tasks/stats` | Get dashboard summary metrics | Private (Bearer Token) |
| `POST` | `/api/tasks` | Create a new academic assignment | Private (Bearer Token) |
| `GET` | `/api/tasks/:id` | Get details of a single task | Private (Bearer Token) |
| `PATCH` | `/api/tasks/:id` | Update task or toggle status | Private (Bearer Token) |
| `DELETE` | `/api/tasks/:id` | Permanently delete an assignment | Private (Bearer Token) |

#### Supported Query Parameters on `GET /api/tasks`:
- `status`: Filter by `pending`, `completed`, or `overdue`.
- `priority`: Filter by `low`, `medium`, or `high`.
- `subject`: Filter by course name (e.g., `Data Structures`).
- `search`: Keyword search matching title, subject, or description.
- `sort`: `dueDate_asc` (default), `dueDate_desc`, `priority_desc`, `priority_asc`, `createdAt_desc`.

---

## 📸 Screenshots

Genuine screenshots captured from the live application are available in the [`screenshots/`](./screenshots) folder:

| Screen | File | Description |
|---|---|---|
| **Sign In** | `screenshots/01_login.png` | Student authentication screen with presentation demo button. |
| **Registration** | `screenshots/02_register.png` | Account registration with student ID and department. |
| **Dashboard** | `screenshots/03_dashboard.png` | Summary cards, overdue alert banner, upcoming deadlines, and progress. |
| **All Tasks** | `screenshots/04_task_management.png` | Task catalog with priority badges and action buttons. |
| **Add Task Modal** | `screenshots/05_add_task_modal.png` | Form for recording new coursework assignments. |
| **Task Filtering** | `screenshots/06_task_filtering.png` | Filtered view isolating overdue or course-specific items. |
| **Mobile Layout** | `screenshots/07_mobile_responsive.png` | Responsive mobile drawer and stacked card interface. |
| **Student Profile** | `screenshots/08_student_profile.png` | Academic statistics and profile customization. |

---

## 🐙 Publishing to GitHub

Follow these exact steps to push this project to your public GitHub account:

1. **Initialize Git in the project root:**
   ```bash
   cd student-task-manager
   git init
   git branch -M main
   ```

2. **Stage and commit all project files:**
   ```bash
   git add .
   git commit -m "feat: complete MERN student task and deadline management system capstone"
   ```

3. **Create a new repository on GitHub:**
   - Log in to [GitHub](https://github.com/).
   - Click the **"+"** icon in the top right corner and select **"New repository"**.
   - Name the repository: `student-task-manager`.
   - Set visibility to **Public**.
   - **Do NOT** check "Add a README file" (we already have a complete one).
   - Click **Create repository**.

4. **Link your local repository and push:**
   ```bash
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/student-task-manager.git
   git push -u origin main
   ```

5. **Verify:**
   Visit `https://github.com/<YOUR_GITHUB_USERNAME>/student-task-manager` in an incognito window to confirm that your repository is publicly accessible and contains all code and documentation.

---

## 🌐 Free-Tier Deployment Guide

Deploy this full-stack project for free to demonstrate it live to your college professors:

### Option A: Backend on Render + Frontend on Vercel (Recommended)

#### 1. Database (MongoDB Atlas Free M0 Cluster)
1. Sign up at [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a free shared cluster (`M0 Sandbox`).
3. Under **Database Access**, create a database user and save the password.
4. Under **Network Access**, add IP address `0.0.0.0/0` (allow access from anywhere).
5. Click **Connect** > **Drivers** > copy the connection string:
   `mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/student_task_manager?retryWrites=true&w=majority`

#### 2. Backend (Render.com)
1. Sign up at [Render](https://render.com/).
2. Click **New +** > **Web Service** and connect your GitHub repository.
3. Configure the service:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add **Environment Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `MONGODB_URI`: `<your MongoDB Atlas connection string>`
   - `JWT_SECRET`: `<a secure random 32-character string>`
   - `JWT_EXPIRES_IN`: `7d`
   - `CLIENT_URL`: `*` (or your frontend Vercel URL once deployed)
5. Deploy the service and note your live API URL: `https://your-backend.onrender.com`.

#### 3. Frontend (Vercel)
1. Sign up at [Vercel](https://vercel.com/).
2. Click **Add New Project** and import your GitHub repository.
3. Configure the project:
   - **Root Directory:** `client`
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add **Environment Variable**:
   - `VITE_API_URL`: `https://your-backend.onrender.com/api`
5. Click **Deploy**. Vercel will build and launch your client Single Page App at `https://your-project.vercel.app`.

---

## 📄 Academic Capstone Documentation

Comprehensive academic deliverables are maintained in the [`docs/`](./docs) folder:
- **[`docs/SRS.md`](./docs/SRS.md)**: Full IEEE 830-compliant Software Requirements Specification covering functional/non-functional criteria, user personas, use cases, and acceptance tests.
- **[`docs/PROJECT_REPORT.md`](./docs/PROJECT_REPORT.md)**: Final project report draft formatted with Abstract, System Design, Data Flow Diagrams, Schema, Test Results, and Academic References.
- **[`docs/TESTING.md`](./docs/TESTING.md)**: Verification document recording all 14 test cases, expected versus actual results, and verification logs.

---

## 👨‍🎓 Author & Academic Integrity

- **Developer:** `[STUDENT FULL NAME - FILL IN]`
- **Course:** B.Tech / B.Sc Computer Science & Engineering
- **Institution:** `[COLLEGE / UNIVERSITY NAME - FILL IN]`
- **Academic Year:** 2025–2026

*This project was developed strictly for academic capstone purposes. All documentation, architecture, and code reflect an original, complete, and reproducible full-stack software system.*
