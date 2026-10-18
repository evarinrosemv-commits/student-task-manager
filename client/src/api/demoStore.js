// Browser local storage fallback to guarantee the live hosted link works 100% reliably
const STORAGE_KEY_TASKS = 'demo_student_tasks_db';
const STORAGE_KEY_USERS = 'demo_student_users_db';

const getInitialTasks = () => {
  const now = new Date();
  const days = (n) => 86400000 * n;

  return [
    {
      _id: 'task_demo_1',
      title: 'Data Structures: Red-Black Tree Implementation',
      subject: 'Data Structures & Algorithms',
      dueDate: new Date(now.getTime() + days(2)).toISOString(),
      priority: 'high',
      status: 'pending',
      description: 'Implement insertion and left/right rotation methods in C++ with unit tests.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'task_demo_2',
      title: 'Operating Systems: Concurrency & Semaphores Lab',
      subject: 'Operating Systems',
      dueDate: new Date(now.getTime() + days(4)).toISOString(),
      priority: 'high',
      status: 'pending',
      description: 'Solve the producer-consumer and dining philosophers synchronization problem using POSIX mutexes.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'task_demo_3',
      title: 'Database Systems: SQL Normalization Assignment',
      subject: 'Database Systems',
      dueDate: new Date(now.getTime() + days(6)).toISOString(),
      priority: 'medium',
      status: 'pending',
      description: 'Decompose relation schemas into BCNF and 3NF, providing functional dependency proofs.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'task_demo_4',
      title: 'Computer Networks: Socket Programming Lab Report',
      subject: 'Computer Networks',
      dueDate: new Date(now.getTime() - days(2)).toISOString(), // Overdue
      priority: 'high',
      status: 'pending',
      description: 'Multi-threaded TCP chat server documentation with Wireshark packet capture analysis.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'task_demo_5',
      title: 'Software Engineering: SRS & Architecture Diagram',
      subject: 'Software Engineering',
      dueDate: new Date(now.getTime() - days(4)).toISOString(),
      priority: 'medium',
      status: 'completed',
      completedAt: new Date(now.getTime() - days(3)).toISOString(),
      description: 'Submit comprehensive IEEE-830 SRS document along with Level-1 DFD and UML diagrams.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'task_demo_6',
      title: 'Discrete Mathematics: Graph Theory Problem Set 4',
      subject: 'Discrete Mathematics',
      dueDate: new Date(now.getTime() + days(8)).toISOString(),
      priority: 'low',
      status: 'pending',
      description: 'Problems on Euler paths, Hamiltonian circuits, and planar graph vertex colorings.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'task_demo_7',
      title: 'Technical Communication: Ethics Seminar Presentation',
      subject: 'Humanities & Ethics',
      dueDate: new Date(now.getTime() - days(6)).toISOString(),
      priority: 'low',
      status: 'completed',
      completedAt: new Date(now.getTime() - days(5)).toISOString(),
      description: 'Prepare a 15-minute slide deck on AI ethics and data privacy in modern computing.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
};

export const getStoredTasks = () => {
  const raw = localStorage.getItem(STORAGE_KEY_TASKS);
  if (!raw) {
    const initial = getInitialTasks();
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    return getInitialTasks();
  }
};

export const saveStoredTasks = (tasks) => {
  localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
};

export const handleDemoRequest = (method, url, data = null, params = {}) => {
  const cleanUrl = url.replace(/^\/api/, '');
  const tasks = getStoredTasks();

  // 1. Auth: Login
  if (method === 'post' && cleanUrl === '/auth/login') {
    const user = {
      _id: 'usr_demo_01',
      name: 'Alex Morgan',
      email: data?.email || 'alex.morgan@college.edu',
      studentId: 'CS2026-089',
      department: 'Computer Science & Engineering',
    };
    return {
      status: 200,
      data: {
        success: true,
        message: 'Login successful (Cloud Demo Mode)',
        token: 'demo_token_' + Date.now(),
        user,
      },
    };
  }

  // 2. Auth: Register
  if (method === 'post' && cleanUrl === '/auth/register') {
    const user = {
      _id: 'usr_demo_' + Date.now(),
      name: data?.name || 'New Student',
      email: data?.email || 'student@college.edu',
      studentId: data?.studentId || 'CS-2026',
      department: data?.department || 'Computer Science',
    };
    return {
      status: 201,
      data: {
        success: true,
        message: 'Registration successful (Cloud Demo Mode)',
        token: 'demo_token_' + Date.now(),
        user,
      },
    };
  }

  // 3. Auth: Current Profile
  if (method === 'get' && cleanUrl === '/auth/me') {
    const saved = localStorage.getItem('student_user');
    const user = saved
      ? JSON.parse(saved)
      : {
          _id: 'usr_demo_01',
          name: 'Alex Morgan',
          email: 'alex.morgan@college.edu',
          studentId: 'CS2026-089',
          department: 'Computer Science & Engineering',
        };
    return { status: 200, data: { success: true, user } };
  }

  // 4. Auth: Update Profile
  if (method === 'patch' && cleanUrl === '/auth/profile') {
    const saved = localStorage.getItem('student_user');
    const user = saved ? JSON.parse(saved) : {};
    if (data?.name) user.name = data.name;
    if (data?.studentId !== undefined) user.studentId = data.studentId;
    if (data?.department !== undefined) user.department = data.department;
    return { status: 200, data: { success: true, message: 'Profile updated', user } };
  }

  // 5. Tasks: Dashboard Stats
  if (method === 'get' && cleanUrl === '/tasks/stats') {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 86400000 * 7);

    const total = tasks.length;
    let completed = 0;
    let pending = 0;
    let overdue = 0;
    let upcoming = 0;
    const priorityCounts = { high: 0, medium: 0, low: 0 };

    tasks.forEach((t) => {
      if (priorityCounts[t.priority] !== undefined) priorityCounts[t.priority]++;
      if (t.status === 'completed') {
        completed++;
      } else {
        pending++;
        const d = new Date(t.dueDate);
        if (d < now) overdue++;
        else if (d <= sevenDaysFromNow) upcoming++;
      }
    });

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const upcomingDeadlines = tasks
      .filter((t) => t.status === 'pending' && new Date(t.dueDate) >= now)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);

    const recentTasks = [...tasks]
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5);

    return {
      status: 200,
      data: {
        success: true,
        stats: { total, pending, completed, overdue, upcoming, completionRate, priorityCounts },
        upcomingDeadlines,
        recentTasks,
      },
    };
  }

  // 6. Tasks: List with search, filters, sort
  if (method === 'get' && cleanUrl === '/tasks') {
    let list = [...tasks];
    const { status, priority, subject, search, sort } = params;

    if (status === 'overdue') {
      const now = new Date();
      list = list.filter((t) => t.status === 'pending' && new Date(t.dueDate) < now);
    } else if (status === 'pending' || status === 'completed') {
      list = list.filter((t) => t.status === status);
    }

    if (priority && priority !== 'all') {
      list = list.filter((t) => t.priority === priority);
    }

    if (subject && subject !== 'all') {
      list = list.filter((t) => t.subject.toLowerCase() === subject.toLowerCase());
    }

    if (search && search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }

    if (sort === 'dueDate_desc') {
      list.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
    } else if (sort === 'priority_desc') {
      const w = { high: 3, medium: 2, low: 1 };
      list.sort((a, b) => (w[b.priority] || 0) - (w[a.priority] || 0));
    } else if (sort === 'priority_asc') {
      const w = { high: 3, medium: 2, low: 1 };
      list.sort((a, b) => (w[a.priority] || 0) - (w[b.priority] || 0));
    } else if (sort === 'createdAt_desc') {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      list.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }

    const subjects = Array.from(new Set(tasks.map((t) => t.subject)));
    return { status: 200, data: { success: true, count: list.length, subjects, tasks: list } };
  }

  // 7. Tasks: Create
  if (method === 'post' && cleanUrl === '/tasks') {
    const newTask = {
      _id: 'task_' + Date.now(),
      title: data.title,
      subject: data.subject,
      dueDate: data.dueDate,
      priority: data.priority || 'medium',
      status: data.status || 'pending',
      description: data.description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    tasks.unshift(newTask);
    saveStoredTasks(tasks);
    return { status: 201, data: { success: true, message: 'Task created', task: newTask } };
  }

  // 8. Tasks: Update
  if (method === 'patch' && cleanUrl.startsWith('/tasks/')) {
    const id = cleanUrl.replace('/tasks/', '');
    const idx = tasks.findIndex((t) => t._id === id);
    if (idx !== -1) {
      tasks[idx] = { ...tasks[idx], ...data, updatedAt: new Date().toISOString() };
      saveStoredTasks(tasks);
      return { status: 200, data: { success: true, task: tasks[idx] } };
    }
  }

  // 9. Tasks: Delete
  if (method === 'delete' && cleanUrl.startsWith('/tasks/')) {
    const id = cleanUrl.replace('/tasks/', '');
    const updated = tasks.filter((t) => t._id !== id);
    saveStoredTasks(updated);
    return { status: 200, data: { success: true, id } };
  }

  return null;
};
