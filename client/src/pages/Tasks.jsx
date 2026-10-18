import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import apiClient from '../api/apiClient';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import ConfirmModal from '../components/ConfirmModal';
import FilterBar from '../components/FilterBar';
import EmptyState from '../components/EmptyState';
import { PlusCircle, Layers, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

const Tasks = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters state initialized from searchParams or defaults
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [status, setStatus] = useState(searchParams.get('status') || 'all');
  const [priority, setPriority] = useState(searchParams.get('priority') || 'all');
  const [subject, setSubject] = useState(searchParams.get('subject') || 'all');
  const [sort, setSort] = useState(searchParams.get('sort') || 'dueDate_asc');

  const [tasks, setTasks] = useState([]);
  const [subjectsList, setSubjectsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Sync state with URL params
  useEffect(() => {
    const statusParam = searchParams.get('status');
    if (statusParam && ['pending', 'completed', 'overdue'].includes(statusParam)) {
      setStatus(statusParam);
    }
  }, [searchParams]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');

      const params = {};
      if (search.trim()) params.search = search.trim();
      if (status !== 'all') params.status = status;
      if (priority !== 'all') params.priority = priority;
      if (subject !== 'all') params.subject = subject;
      if (sort) params.sort = sort;

      const response = await apiClient.get('/tasks', { params });
      if (response.data.success) {
        setTasks(response.data.tasks || []);
        if (response.data.subjects) {
          setSubjectsList(response.data.subjects);
        }
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load assignments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTasks();
    }, 250); // slight debounce for search input
    return () => clearTimeout(timer);
  }, [search, status, priority, subject, sort]);

  const handleResetFilters = () => {
    setSearch('');
    setStatus('all');
    setPriority('all');
    setSubject('all');
    setSort('dueDate_asc');
    setSearchParams({});
  };

  const handleToggleStatus = async (task) => {
    try {
      const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
      await apiClient.patch(`/tasks/${task._id}`, { status: nextStatus });
      fetchTasks();
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };

  const handleSaveTask = async (taskData) => {
    if (taskToEdit) {
      await apiClient.patch(`/tasks/${taskToEdit._id}`, taskData);
    } else {
      await apiClient.post('/tasks', taskData);
    }
    fetchTasks();
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      await apiClient.delete(`/tasks/${taskToDelete._id}`);
      setTaskToDelete(null);
      fetchTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Assignments &amp; Tasks
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage course deadlines, filter by subject or priority, and mark completed work
          </p>
        </div>

        <button
          onClick={() => {
            setTaskToEdit(null);
            setIsTaskModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm shadow-indigo-200 transition"
        >
          <PlusCircle className="w-4 h-4" />
          Add Assignment
        </button>
      </div>

      {/* Filter and Search Bar */}
      <FilterBar
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        priority={priority}
        setPriority={setPriority}
        subject={subject}
        setSubject={setSubject}
        sort={sort}
        setSort={setSort}
        subjects={subjectsList}
        onReset={handleResetFilters}
      />

      {/* Result Status Strip */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong className="text-slate-800">{tasks.length}</strong>{' '}
          {tasks.length === 1 ? 'assignment' : 'assignments'}
        </span>
        {status !== 'all' && (
          <span className="capitalize font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
            Filtered by: {status}
          </span>
        )}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-9 h-9 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-sm text-slate-500">Retrieving assignments...</p>
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState
          title={search || status !== 'all' || priority !== 'all' || subject !== 'all' ? 'No matching assignments' : 'No tasks created yet'}
          description={
            search || status !== 'all' || priority !== 'all' || subject !== 'all'
              ? 'Try adjusting your search criteria or resetting the filters.'
              : 'Keep yourself organized this semester by adding your first project or homework assignment!'
          }
          onAction={() => {
            if (search || status !== 'all' || priority !== 'all' || subject !== 'all') {
              handleResetFilters();
            } else {
              setTaskToEdit(null);
              setIsTaskModalOpen(true);
            }
          }}
          actionLabel={
            search || status !== 'all' || priority !== 'all' || subject !== 'all'
              ? 'Reset All Filters'
              : 'Add Assignment'
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tasks.map((task) => (
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

      {/* Task Creation / Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setTaskToEdit(null);
        }}
        onSave={handleSaveTask}
        task={taskToEdit}
        existingSubjects={subjectsList}
      />

      {/* Delete Confirmation Modal */}
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

export default Tasks;
