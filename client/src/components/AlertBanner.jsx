import React from 'react';
import { AlertTriangle, CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const bannerStyles = {
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-800',
    iconColor: 'text-amber-600',
    Icon: AlertTriangle,
  },
  error: {
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    text: 'text-rose-800',
    iconColor: 'text-rose-600',
    Icon: AlertCircle,
  },
  success: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-800',
    iconColor: 'text-emerald-600',
    Icon: CheckCircle,
  },
  info: {
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    text: 'text-indigo-800',
    iconColor: 'text-indigo-600',
    Icon: Info,
  },
};

const AlertBanner = ({ type = 'info', title, message, onClose, action }) => {
  const style = bannerStyles[type] || bannerStyles.info;
  const Icon = style.Icon;

  return (
    <div
      className={`rounded-xl border p-4 mb-6 flex items-start justify-between gap-3 ${style.bg} ${style.border}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${style.iconColor}`} />
        <div>
          {title && <h4 className={`text-sm font-bold ${style.text}`}>{title}</h4>}
          {message && <p className={`text-xs mt-0.5 ${style.text} leading-relaxed`}>{message}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {action}
        {onClose && (
          <button
            onClick={onClose}
            className={`p-1 rounded-md hover:bg-black/5 transition ${style.text}`}
            aria-label="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default AlertBanner;
