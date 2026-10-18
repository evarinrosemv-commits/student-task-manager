import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  LayoutDashboard,
  CheckSquare,
  User,
  LogOut,
  Menu,
  X,
  PlusCircle,
} from 'lucide-react';

const Navbar = ({ onOpenAddTask }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'All Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'My Profile', path: '/profile', icon: User },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-100 group-hover:bg-indigo-700 transition">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="font-bold text-slate-900 text-lg tracking-tight block leading-tight">
                  Student<span className="text-indigo-600">Tasks</span>
                </span>
                <span className="text-xs text-slate-500 font-medium hidden sm:block">
                  Academic Deadline Manager
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Action & User profile */}
          <div className="hidden md:flex items-center gap-3">
            {onOpenAddTask && (
              <button
                onClick={onOpenAddTask}
                className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <PlusCircle className="w-4 h-4" />
                Add Task
              </button>
            )}

            <div className="h-6 w-px bg-slate-200 mx-1"></div>

            <Link
              to="/profile"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition"
              title="View student profile"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs border border-indigo-200">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="text-left text-xs">
                <span className="font-semibold text-slate-800 block truncate max-w-[120px]">
                  {user?.name || 'Student'}
                </span>
                <span className="text-slate-400 block truncate max-w-[120px]">
                  {user?.studentId || user?.email}
                </span>
              </div>
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
              title="Sign out of student account"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            {onOpenAddTask && (
              <button
                onClick={onOpenAddTask}
                className="p-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm"
                title="Add task"
              >
                <PlusCircle className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                {link.name}
              </Link>
            );
          })}

          <div className="border-t border-slate-200 my-2 pt-2">
            <div className="px-3 py-2 text-xs text-slate-500">
              Signed in as <span className="font-semibold text-slate-700">{user?.name}</span> ({user?.email})
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-lg text-sm font-semibold transition"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
