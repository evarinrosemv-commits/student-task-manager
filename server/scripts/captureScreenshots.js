const path = require('path');
const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const puppeteer = require('puppeteer-core');

const app = require('../src/app');
const User = require('../src/models/User');
const Task = require('../src/models/Task');

const PORT = 5055;
const SCREENSHOTS_DIR = path.join(__dirname, '../../screenshots');
const CLIENT_DIST = path.join(__dirname, '../../client/dist');

// Candidate browser paths on Windows
const BROWSER_PATHS = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
];

const findBrowserExecutable = () => {
  for (const p of BROWSER_PATHS) {
    if (fs.existsSync(p)) return p;
  }
  throw new Error('No supported browser executable found (Chrome / Edge).');
};

async function run() {
  console.log('[1/5] Initializing In-Memory Database...');
  const mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  console.log('[2/5] Seeding Realistic Academic Data...');
  // 1. Create Student User
  const student = await User.create({
    name: 'Alex Morgan',
    email: 'alex.morgan@college.edu',
    password: 'Password123!',
    studentId: 'CS2026-089',
    department: 'Computer Science & Engineering',
  });

  const now = new Date();
  const days = (n) => 86400000 * n;

  // 2. Seed Realistic Assignments
  await Task.create([
    {
      user: student._id,
      title: 'Data Structures: Red-Black Tree Implementation',
      subject: 'Data Structures & Algorithms',
      dueDate: new Date(now.getTime() + days(2)), // In 2 days
      priority: 'high',
      status: 'pending',
      description: 'Implement insertion and left/right rotation methods in C++ with unit tests.',
    },
    {
      user: student._id,
      title: 'Operating Systems: Concurrency & Semaphores Lab',
      subject: 'Operating Systems',
      dueDate: new Date(now.getTime() + days(4)), // In 4 days
      priority: 'high',
      status: 'pending',
      description: 'Solve the producer-consumer and dining philosophers synchronization problem using POSIX mutexes.',
    },
    {
      user: student._id,
      title: 'Database Systems: SQL Normalization Assignment',
      subject: 'Database Systems',
      dueDate: new Date(now.getTime() + days(6)), // In 6 days
      priority: 'medium',
      status: 'pending',
      description: 'Decompose relation schemas into BCNF and 3NF, providing functional dependency proofs.',
    },
    {
      user: student._id,
      title: 'Computer Networks: Socket Programming Lab Report',
      subject: 'Computer Networks',
      dueDate: new Date(now.getTime() - days(2)), // OVERDUE (2 days ago)
      priority: 'high',
      status: 'pending',
      description: 'Multi-threaded TCP chat server documentation with Wireshark packet capture analysis.',
    },
    {
      user: student._id,
      title: 'Software Engineering: SRS & Architecture Diagram',
      subject: 'Software Engineering',
      dueDate: new Date(now.getTime() - days(4)),
      priority: 'medium',
      status: 'completed',
      completedAt: new Date(now.getTime() - days(3)),
      description: 'Submit comprehensive IEEE-830 SRS document along with Level-1 DFD and UML diagrams.',
    },
    {
      user: student._id,
      title: 'Discrete Mathematics: Graph Theory Problem Set 4',
      subject: 'Discrete Mathematics',
      dueDate: new Date(now.getTime() + days(8)),
      priority: 'low',
      status: 'pending',
      description: 'Problems on Euler paths, Hamiltonian circuits, and planar graph vertex colorings.',
    },
    {
      user: student._id,
      title: 'Technical Communication: Ethics Seminar Presentation',
      subject: 'Humanities & Ethics',
      dueDate: new Date(now.getTime() - days(6)),
      priority: 'low',
      status: 'completed',
      completedAt: new Date(now.getTime() - days(5)),
      description: 'Prepare a 15-minute slide deck on AI ethics and data privacy in modern computing.',
    },
  ]);

  console.log('[3/5] Starting Integrated HTTP Server (API + Frontend SPA)...');
  app.use(express.static(CLIENT_DIST));
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) return next();
    res.sendFile(path.join(CLIENT_DIST, 'index.html'));
  });

  const server = app.listen(PORT);
  console.log(`Server listening on http://localhost:${PORT}`);

  console.log('[4/5] Launching Headless Chrome Browser...');
  const browserPath = findBrowserExecutable();
  console.log(`Using browser: ${browserPath}`);

  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: browserPath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  // 1. Screenshot: Login Page
  console.log('Capturing: 01_login.png');
  await page.goto(`http://localhost:${PORT}/login`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '01_login.png') });

  // 2. Screenshot: Registration Page
  console.log('Capturing: 02_register.png');
  await page.goto(`http://localhost:${PORT}/register`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '02_register.png') });

  // 3. Authenticate and capture Dashboard
  console.log('Authenticating in UI...');
  await page.goto(`http://localhost:${PORT}/login`, { waitUntil: 'networkidle0' });
  await page.type('input[name="email"]', 'alex.morgan@college.edu');
  await page.type('input[name="password"]', 'Password123!');
  await page.click('button[type="submit"]');

  // Wait for dashboard navigation
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1200));

  console.log('Capturing: 03_dashboard.png');
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '03_dashboard.png') });

  // 4. Screenshot: All Tasks Catalog
  console.log('Capturing: 04_task_management.png');
  await page.goto(`http://localhost:${PORT}/tasks`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '04_task_management.png') });

  // 5. Screenshot: Add Task Modal Form
  console.log('Capturing: 05_add_task_modal.png');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const addBtn = buttons.find((b) => b.textContent.includes('Add Assignment'));
    if (addBtn) addBtn.click();
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '05_add_task_modal.png') });

  // Close modal
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const cancelBtn = buttons.find((b) => b.textContent.includes('Cancel'));
    if (cancelBtn) cancelBtn.click();
  });
  await new Promise((r) => setTimeout(r, 500));

  // 6. Screenshot: Filtered Tasks (e.g. Overdue)
  console.log('Capturing: 06_task_filtering.png');
  await page.goto(`http://localhost:${PORT}/tasks?status=overdue`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '06_task_filtering.png') });

  // 7. Screenshot: Mobile Responsive View
  console.log('Capturing: 07_mobile_responsive.png');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 }); // iPhone 14
  await page.goto(`http://localhost:${PORT}/dashboard`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '07_mobile_responsive.png') });

  // 8. Screenshot: Student Profile Page
  console.log('Capturing: 08_student_profile.png');
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto(`http://localhost:${PORT}/profile`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '08_student_profile.png') });

  console.log('[5/5] Cleaning up...');
  await browser.close();
  server.close();
  await mongoose.disconnect();
  await mongoServer.stop();

  console.log('SUCCESS! All 8 authentic screenshots captured and saved to screenshots/ directory.');
  process.exit(0);
}

run().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
