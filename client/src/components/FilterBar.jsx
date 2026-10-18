import React from 'react';
import { Search, Filter, ArrowUpDown, X } from 'lucide-react';

const FilterBar = ({
  search,
  setSearch,
  status,
  setStatus,
  priority,
  setPriority,
  subject,
  setSubject,
  sort,
  setSort,
  subjects = [],
  onReset,
}) => {
  const hasActiveFilters =
    search || status !== 'all' || priority !== 'all' || subject !== 'all' || sort !== 'dueDate_asc';

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm mb-6 space-y-3">
      {/* Search Input Row */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search tasks by title, subject, or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-400"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Selectors Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 pt-1">
        {/* Status Filter */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>

        {/* Subject Filter */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Subject
          </label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 truncate"
          >
            <option value="all">All Subjects</option>
            {subjects.map((sub, idx) => (
              <option key={idx} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Filter */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Sort By
          </label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="dueDate_asc">Due Date (Soonest)</option>
            <option value="dueDate_desc">Due Date (Furthest)</option>
            <option value="priority_desc">Priority (High to Low)</option>
            <option value="priority_asc">Priority (Low to High)</option>
            <option value="createdAt_desc">Recently Created</option>
          </select>
        </div>

        {/* Reset Filter Button */}
        <div className="flex items-end col-span-2 sm:col-span-4 lg:col-span-1">
          {hasActiveFilters ? (
            <button
              onClick={onReset}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 transition flex items-center justify-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          ) : (
            <div className="text-[11px] text-slate-400 py-2 w-full text-center">
              Showing all items
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
