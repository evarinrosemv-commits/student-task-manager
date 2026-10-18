import React from 'react';

const colorStyles = {
  indigo: {
    bg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    border: 'border-indigo-100',
    dot: 'bg-indigo-500',
  },
  emerald: {
    bg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    border: 'border-emerald-100',
    dot: 'bg-emerald-500',
  },
  amber: {
    bg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    border: 'border-amber-100',
    dot: 'bg-amber-500',
  },
  rose: {
    bg: 'bg-rose-50',
    iconColor: 'text-rose-600',
    border: 'border-rose-100',
    dot: 'bg-rose-500',
  },
};

const StatCard = ({ title, value, icon: Icon, color = 'indigo', subtitle, onClick }) => {
  const styles = colorStyles[color] || colorStyles.indigo;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition duration-200 ${
        onClick ? 'cursor-pointer hover:border-indigo-200' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${styles.bg} ${styles.iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</span>
        {subtitle && (
          <span className="text-xs font-medium text-slate-500 truncate">{subtitle}</span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
