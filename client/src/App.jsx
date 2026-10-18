import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import TaskModal from './components/TaskModal';
import apiClient from './api/apiClient';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Wrapper layout that renders Navbar only for authenticated views
const AppLayout = () => {
  const { isAuthenticated } = useAuth();
  const [isQuickAddModalOpen, setIsQuickAddModalOpen] = useState(false);

  const handleQuickSave = async (taskData) => {
    await apiClient.post('/tasks', taskData);
    // Reload or dispatch event to refresh active views
    window.dispatchEvent(new Event('task:created'));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {isAuthenticated && (
        <Navbar onOpenAddTask={() => setIsQuickAddModalOpen(true)} />
      )}

      <main className="flex-1">
        <Routes>
          {/* Public Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Root Redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Protected Application Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Catch-all 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Global Quick Add Task Modal */}
      {isAuthenticated && (
        <TaskModal
          isOpen={isQuickAddModalOpen}
          onClose={() => setIsQuickAddModalOpen(false)}
          onSave={handleQuickSave}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-medium text-slate-600">
            Student Task &amp; Deadline Management System &bull; College Capstone Project
          </p>
          <p className="mt-1 text-slate-400">
            Full-Stack MERN Architecture (MongoDB, Express, React, Node.js)
          </p>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
}

export default App;
