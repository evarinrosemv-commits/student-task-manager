import React from 'react';
import { ClipboardList, PlusCircle } from 'lucide-react';

const EmptyState = ({
  title = 'No tasks found',
  description = 'You currently have no tasks matching this criteria. Create a new assignment to keep track of your coursework!',
  onAction,
  actionLabel = 'Create Your First Task',
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto shadow-sm my-6">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 border border-indigo-100">
        <ClipboardList className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed mb-6">{description}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-100 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <PlusCircle className="w-4 h-4" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
