import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Task Confirmation',
  message = 'Are you sure you want to delete this task? This action cannot be undone.',
  confirmText = 'Delete Task',
  isDanger = true,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all p-6">
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              isDanger ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'
            }`}
          >
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            <p className="mt-1 text-sm text-slate-600 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 text-sm font-semibold text-white rounded-lg transition shadow-sm ${
              isDanger
                ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-200'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
