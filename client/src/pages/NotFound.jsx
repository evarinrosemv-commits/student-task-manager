import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 text-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6">
        <GraduationCap className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-black text-slate-900 tracking-tight">404</h1>
      <h2 className="text-xl font-bold text-slate-800 mt-2">Page Not Found</h2>
      <p className="text-slate-500 text-sm mt-1 max-w-sm">
        The academic view or task resource you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/dashboard"
        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
