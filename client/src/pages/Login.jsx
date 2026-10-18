import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Mail, Lock, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in both your email address and password.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await login(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick fill helper for college viva / demo presentations
  const fillDemoAccount = () => {
    setFormData({
      email: 'alex.morgan@college.edu',
      password: 'Password123!',
    });
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Icon */}
        <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h2 className="mt-4 text-center text-2xl font-extrabold text-slate-900 tracking-tight">
          Student Task &amp; Deadline Manager
        </h2>
        <p className="mt-1 text-center text-sm text-slate-500">
          Sign in to access your coursework, track deadlines, and monitor tasks
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200/80 rounded-2xl sm:px-10">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                College Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="student@college.edu"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition disabled:opacity-50"
            >
              {isLoading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo Helper Button */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <button
              type="button"
              onClick={fillDemoAccount}
              className="w-full py-2 px-3 rounded-lg border border-dashed border-indigo-300 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              Demo Account (For College Presentation)
            </button>
          </div>

          {/* Registration link */}
          <p className="mt-5 text-center text-xs text-slate-600">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
