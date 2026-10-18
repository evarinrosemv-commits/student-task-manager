import React, { useState, useEffect } from 'react';
import { X, Calendar, BookOpen, AlertCircle } from 'lucide-react';

const TaskModal = ({ isOpen, onClose, onSave, task = null, existingSubjects = [] }) => {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    dueDate: '',
    priority: 'medium',
    status: 'pending',
    description: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper to convert date to datetime-local format (YYYY-MM-DDTHH:mm)
  const formatDateTimeLocal = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        subject: task.subject || '',
        dueDate: formatDateTimeLocal(task.dueDate),
        priority: task.priority || 'medium',
        status: task.status || 'pending',
        description: task.description || '',
      });
    } else {
      // Default due date to tomorrow at 23:59
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(23, 59, 0, 0);

      setFormData({
        title: '',
        subject: existingSubjects.length > 0 ? existingSubjects[0] : '',
        dueDate: formatDateTimeLocal(tomorrow),
        priority: 'medium',
        status: 'pending',
        description: '',
      });
    }
    setErrors({});
  }, [task, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    } else if (formData.title.length > 120) {
      newErrors.title = 'Title cannot exceed 120 characters';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject or course name is required';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await onSave({
        ...formData,
        dueDate: new Date(formData.dueDate).toISOString(),
      });
      onClose();
    } catch (err) {
      setErrors({ form: err.response?.data?.message || err.message || 'Failed to save task' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800">
            {task ? 'Edit Assignment / Task' : 'Create New Academic Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.form && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.form}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Lab 4: B-Trees Implementation"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition ${
                errors.title ? 'border-rose-400 focus:border-rose-500' : 'border-slate-300 focus:border-indigo-500'
              }`}
            />
            {errors.title && <p className="mt-1 text-xs text-rose-600">{errors.title}</p>}
          </div>

          {/* Subject & Due Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Subject */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Subject / Course <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                list="subjects-list"
                required
                placeholder="e.g. Operating Systems"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition ${
                  errors.subject ? 'border-rose-400 focus:border-rose-500' : 'border-slate-300 focus:border-indigo-500'
                }`}
              />
              <datalist id="subjects-list">
                {existingSubjects.map((sub, idx) => (
                  <option key={idx} value={sub} />
                ))}
              </datalist>
              {errors.subject && <p className="mt-1 text-xs text-rose-600">{errors.subject}</p>}
            </div>

            {/* Due Date & Time */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Deadline <span className="text-rose-500">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition ${
                  errors.dueDate ? 'border-rose-400 focus:border-rose-500' : 'border-slate-300 focus:border-indigo-500'
                }`}
              />
              {errors.dueDate && <p className="mt-1 text-xs text-rose-600">{errors.dueDate}</p>}
            </div>
          </div>

          {/* Priority & Status Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Priority */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-white"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>

            {/* Status (when editing) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-white"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Description / Notes (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Add submission guidelines, textbook chapters, or reference links..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            ></textarea>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-200 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
