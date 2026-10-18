import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/apiClient';
import {
  User,
  Mail,
  Hash,
  BookOpen,
  Calendar,
  LogOut,
  CheckCircle2,
  Clock,
  AlertCircle,
  Save,
} from 'lucide-react';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    studentId: user?.studentId || '',
    department: user?.department || '',
  });

  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    completionRate: 0,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        studentId: user.studentId || '',
        department: user.department || '',
      });
    }

    const fetchStats = async () => {
      try {
        const response = await apiClient.get('/tasks/stats');
        if (response.data.success) {
          setStats(response.data.stats);
        }
      } catch (err) {
        console.error('Failed to load profile stats:', err);
      }
    };

    fetchStats();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setSuccessMessage('');
      setErrorMessage('');

      const response = await apiClient.patch('/auth/profile', formData);
      if (response.data.success) {
        updateUser(response.data.user);
        setSuccessMessage('Student profile details updated successfully!');
        setTimeout(() => setSuccessMessage(''), 4000);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-20 h-20 rounded-2xl bg-indigo-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
          </div>

          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl font-black text-slate-900">{user?.name}</h1>
            <p className="text-sm text-slate-500 font-medium">{user?.email}</p>
            <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-2 text-xs">
              {user?.studentId && (
                <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
                  ID: {user.studentId}
                </span>
              )}
              {user?.department && (
                <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium border border-slate-200">
                  {user.department}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 transition"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Academic Performance Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 text-center">
          <span className="text-2xl font-black text-slate-800 block">{stats.total}</span>
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">
            Total Tasks
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 text-center">
          <span className="text-2xl font-black text-emerald-600 block">{stats.completed}</span>
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">
            Completed
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 text-center">
          <span className="text-2xl font-black text-amber-600 block">{stats.pending}</span>
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">
            Pending
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 text-center">
          <span className="text-2xl font-black text-indigo-600 block">
            {stats.completionRate}%
          </span>
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">
            Success Rate
          </span>
        </div>
      </div>

      {/* Edit Profile Details */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900">Student Profile Information</h2>
          <p className="text-xs text-slate-500">
            Keep your student registration number and department information updated.
          </p>
        </div>

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Email Address (Login Identity)
            </label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 text-sm cursor-not-allowed"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Email is permanently bound to your student record for security.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Student ID / Roll No
              </label>
              <input
                type="text"
                placeholder="e.g. CS2026-042"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Department / Major
              </label>
              <input
                type="text"
                placeholder="e.g. Computer Science"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-indigo-100 transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
