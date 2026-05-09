import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, Loader2, ArrowLeft, CheckCircle2, Eye, EyeOff, User, Mail, Lock } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Registration should go through your own backend proxy so admin tokens
// never reach the browser.
const REGISTER_ENDPOINT = import.meta.env.VITE_REGISTER_ENDPOINT;

function PasswordStrength({ password }) {
  const checks = [
    { label: 'At least 8 characters', ok: password.length >= 8 },
    { label: 'Contains a number',     ok: /\d/.test(password) },
    { label: 'Contains uppercase',    ok: /[A-Z]/.test(password) },
    { label: 'Contains symbol',       ok: /[^a-zA-Z0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.ok).length;
  const bar = ['bg-red-500', 'bg-red-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-500'][score];

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[0,1,2,3].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < score ? bar : 'bg-white/10'}`} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-1">
        {checks.map(({ label, ok }) => (
          <div key={label} className={`flex items-center gap-1.5 text-xs transition-colors ${ok ? 'text-green-400' : 'text-slate-600'}`}>
            <CheckCircle2 size={10} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!REGISTER_ENDPOINT) {
      toast.error('Registration endpoint is not configured');
      return;
    }

    if (form.password !== form.confirm_password) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      await axios.post(REGISTER_ENDPOINT, {
        email:      form.email,
        password:   form.password,
        first_name: form.first_name || undefined,
        last_name:  form.last_name  || undefined,
      });
      setSuccess(true);
    } catch (err) {
      const msg = err?.response?.data?.message
        || Object.values(err?.response?.data?.errors || {}).flat().join(' ')
        || 'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const fieldCls = 'w-full bg-[#0a0c12] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors';

  // ── Success screen ──────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-[#0a0c12] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-md flex items-center justify-center">
              <Globe size={13} className="text-white" />
            </div>
            <span className="font-bold text-white text-sm">CloudPanel</span>
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 size={28} className="text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Account Created!</h2>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Your account has been created successfully. You can now sign in and start deploying servers.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-colors"
            >
              Sign In Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Form ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0a0c12] flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-600 rounded-md flex items-center justify-center">
            <Globe size={13} className="text-white" />
          </div>
          <span className="font-bold text-white text-sm">CloudPanel</span>
        </Link>
        <Link to="/" className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors">
          <ArrowLeft size={12} /> Back to website
        </Link>
      </div>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-7">
            <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
            <p className="text-sm text-slate-500">Start deploying servers in minutes</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  <User size={10} className="inline mr-1" />First Name
                </label>
                <input
                  value={form.first_name}
                  onChange={e => set('first_name', e.target.value)}
                  placeholder="John"
                  className={fieldCls}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Last Name</label>
                <input
                  value={form.last_name}
                  onChange={e => set('last_name', e.target.value)}
                  placeholder="Doe"
                  className={fieldCls}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                <Mail size={10} className="inline mr-1" />Email Address <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder="john@example.com"
                className={fieldCls}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                <Lock size={10} className="inline mr-1" />Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                  placeholder="Create a strong password"
                  className={`${fieldCls} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {form.password && <PasswordStrength password={form.password} />}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Confirm Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={form.confirm_password}
                  onChange={e => set('confirm_password', e.target.value)}
                  placeholder="Repeat your password"
                  className={`${fieldCls} pr-10 ${
                    form.confirm_password && form.confirm_password !== form.password
                      ? 'border-red-500/50'
                      : form.confirm_password && form.confirm_password === form.password
                      ? 'border-green-500/50'
                      : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {form.confirm_password && form.confirm_password !== form.password && (
                <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
              )}
            </div>

            {/* Terms */}
            <p className="text-xs text-slate-600 leading-relaxed">
              By creating an account you agree to our{' '}
              <a href="#" className="text-indigo-400 hover:text-indigo-300">Terms of Service</a> and{' '}
              <a href="#" className="text-indigo-400 hover:text-indigo-300">Privacy Policy</a>.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 mt-1"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              Create Account
            </button>
          </form>

          <p className="text-center text-xs text-slate-600 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
