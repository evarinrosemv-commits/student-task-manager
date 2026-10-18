import React from 'react';
import {
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Edit2,
  Trash2,
  Clock,
  BookOpen,
} from 'lucide-react';

const priorityColors = {
  high: 'bg-rose-50 text-rose-700 border-rose-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const TaskCard = ({ task, onToggleStatus, onEdit, onDelete }) => {
  const isCompleted = task.status === 'completed';
  const dueDate = new Date(task.dueDate);
  const now = new Date();
  const isOverdue = !isCompleted && dueDate < now;

  // Format date readable for students
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div
      className={`group bg-white rounded-xl border p-5 transition-all duration-200 shadow-sm hover:shadow-md ${
        isCompleted
          ? 'border-slate-200/60 bg-slate-50/50 opacity-80'
          : isOverdue
          ? 'border-rose-200 ring-1 ring-rose-200/50'
          : 'border-slate-200/80 hover:border-indigo-200'
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Toggle completion status button */}
        <button
          onClick={() => onToggleStatus(task)}
          className="mt-0.5 text-slate-400 hover:text-indigo-600 focus:outline-none transition-colors"
          title={isCompleted ? 'Mark as pending' : 'Mark as completed'}
          aria-label={isCompleted ? 'Mark as pending' : 'Mark as completed'}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" />
          ) : (
            <Circle className="w-5 h-5 hover:text-indigo-500" />
          )}
        </button>

        {/* Task Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            {/* Subject badge */}
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
              <BookOpen className="w-3 h-3 text-slate-500" />
              {task.subject}
            </span>

            {/* Priority badge */}
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${
                priorityColors[task.priority] || priorityColors.medium
              }`}
            >
              {task.priority} Priority
            </span>

            {/* Overdue tag */}
            {isOverdue && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
                <AlertTriangle className="w-3 h-3 text-rose-600" />
                Overdue
              </span>
            )}

            {/* Completed tag */}
            {isCompleted && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                Completed
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            className={`text-base font-semibold leading-snug break-words ${
              isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
            }`}
          >
            {task.title}
          </h3>

          {/* Description */}
          {task.description && (
            <p
              className={`mt-1.5 text-sm leading-relaxed line-clamp-2 ${
                isCompleted ? 'text-slate-400 line-through' : 'text-slate-600'
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Due date information */}
          <div className="mt-3.5 flex flex-wrap items-center justify-between text-xs gap-2 pt-2 border-t border-slate-100">
            <div
              className={`flex items-center gap-1.5 font-medium ${
                isOverdue
                  ? 'text-rose-600 font-semibold'
                  : isCompleted
                  ? 'text-slate-400'
                  : 'text-slate-500'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Due: {formatDate(dueDate)}</span>
            </div>

            {/* Actions: Edit & Delete */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit(task)}
                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition"
                title="Edit task"
                aria-label="Edit task"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(task)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition"
                title="Delete task"
                aria-label="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
