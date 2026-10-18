import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/apiClient';
import StatCard from '../components/StatCard';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import ConfirmModal from '../components/ConfirmModal';
import EmptyState from '../components/EmptyState';
import AlertBanner from '../components/AlertBanner';
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    overdue: 0,
    upcoming: 0,
    completionRate: 0,
    priorityCounts: { high: 0, medium: 0, low: 0 },
  });

  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiClient.get('/tasks/stats');
      if (response.data.success) {
        setStats(response.data.stats);
        setUpcomingDeadlines(response.data.upcomingDeadlines || []);
        setRecentTasks(response.data.recentTasks || []);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError('Could not load dashboard metrics. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleToggleStatus = async (task) => {
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      await apiClient.patch(`/tasks/${task._id}`, { status: newStatus });
      fetchDashboardData();
    } catch (err) {
      console.error('Error toggling task status:', err);
    }
  };

  const handleSaveTask = async (taskData) => {
    if (taskToEdit) {
      await apiClient.patch(`/tasks/${taskToEdit._id}`, taskData);
    } else {
      await apiClient.post('/tasks', taskData);
    }
    fetchDashboardData();
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      await apiClient.delete(`/tasks/${taskToDelete._id}`);
      setTaskToDelete(null);
      fetchDashboardData();
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm">Loading your academic metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 rounded-2xl p-6 sm:p-8 text-white shadow-lg shadow-indigo-100">
        <div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white mb-2 backdrop-blur-sm">
            Academic Term 2026
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {user?.name || 'Student'}! 👋
          </h1>
          <p className="text-indigo-100 text-sm mt-1 max-w-xl">
            Here is your workload summary. Stay ahead of deadlines and keep assignments on track.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setTaskToEdit(null);
              setIsTaskModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-white text-indigo-700 hover:bg-indigo-50 shadow-sm transition transform active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            New Assignment
          </button>
        </div>
      </div>

      {/* Overdue Warning Alert */}
      {stats.overdue > 0 && (
        <AlertBanner
          type="error"
          title={`Attention: You have ${stats.overdue} overdue ${
            stats.overdue === 1 ? 'assignment' : 'assignments'
          }!`}
          message="Review past-due tasks promptly to complete pending academic submissions."
          action={
            <button
              onClick={() => navigate('/tasks?status=overdue')}
              className="text-xs font-bold text-rose-700 hover:text-rose-900 underline whitespace-nowrap"
            >
              View Overdue Tasks &rarr;
            </button>
          }
        />
      )}

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Assignments"
          value={stats.total}
          icon={Layers}
          color="indigo"
          subtitle="All recorded tasks"
          onClick={() => navigate('/tasks')}
        />
        <StatCard
          title="Pending Work"
          value={stats.pending}
          icon={Clock}
          color="amber"
          subtitle="Tasks awaiting completion"
          onClick={() => navigate('/tasks?status=pending')}
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon={CheckCircle2}
          color="emerald"
          subtitle={`${stats.completionRate}% completion rate`}
          onClick={() => navigate('/tasks?status=completed')}
        />
        <StatCard
          title="Overdue"
          value={stats.overdue}
          icon={AlertTriangle}
          color="rose"
          subtitle="Past submission date"
          onClick={() => navigate('/tasks?status=overdue')}
        />
      </div>

      {/* Academic Progress & Priority Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Completion Progress Bar */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-800">Overall Progress</h3>
              <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                {stats.completionRate}%
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              {stats.completed} of {stats.total} tasks completed
            </p>

            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200/60">
              <div
                className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${stats.completionRate}%` }}
              ></div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>{stats.pending} remaining</span>
            <span>Target: 100% completion</span>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm lg:col-span-2">
          <h3 className="text-sm font-bold text-slate-800 mb-1">Task Priority Distribution</h3>
          <p className="text-xs text-slate-500 mb-4">
            Balance workload urgency by reviewing tasks categorized by priority
          </p>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200/70">
              <span className="text-2xl font-black text-rose-700 block">
                {stats.priorityCounts?.high || 0}
              </span>
              <span className="text-xs font-semibold text-rose-800 uppercase tracking-wider">
                High Priority
              </span>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/70">
              <span className="text-2xl font-black text-amber-700 block">
                {stats.priorityCounts?.medium || 0}
              </span>
              <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
                Medium Priority
              </span>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200/70">
              <span className="text-2xl font-black text-emerald-700 block">
                {stats.priorityCounts?.low || 0}
              </span>
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                Low Priority
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Deadlines & Recent Tasks Sections */}
      {stats.total === 0 ? (
        <EmptyState
          title="Welcome to your task manager!"
          description="You haven't recorded any tasks or assignments yet. Get started by creating your first course assignment."
          onAction={() => {
            setTaskToEdit(null);
            setIsTaskModalOpen(true);
          }}
          actionLabel="Create Your First Assignment"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Deadlines (Next 7 Days) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-900">Upcoming Deadlines</h2>
              </div>
              <span className="text-xs text-slate-500 font-medium">Due in next 7 days</span>
            </div>

            {upcomingDeadlines.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200/80 p-8 text-center text-slate-500 text-sm">
                No upcoming deadlines in the next 7 days! Great job staying caught up.
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingDeadlines.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onToggleStatus={handleToggleStatus}
                    onEdit={(t) => {
                      setTaskToEdit(t);
                      setIsTaskModalOpen(true);
                    }}
                    onDelete={(t) => setTaskToDelete(t)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Recent Tasks */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-900">Recent Tasks</h2>
              </div>
              <button
                onClick={() => navigate('/tasks')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                View All &rarr;
              </button>
            </div>

            <div className="space-y-3">
              {recentTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onToggleStatus={handleToggleStatus}
                  onEdit={(t) => {
                    setTaskToEdit(t);
                    setIsTaskModalOpen(true);
                  }}
                  onDelete={(t) => setTaskToDelete(t)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Task Creation / Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setTaskToEdit(null);
        }}
        onSave={handleSaveTask}
        task={taskToEdit}
      />

      {/* Deletion Confirmation Modal */}
      <ConfirmModal
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleDeleteTask}
        title="Delete Assignment"
        message={`Are you sure you want to delete "${taskToDelete?.title}"? This record will be permanently removed.`}
      />
    </div>
  );
};

export default Dashboard;
