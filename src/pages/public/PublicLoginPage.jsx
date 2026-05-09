import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Globe, Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PublicLoginPage() {
  const { login, login2fa, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [twoFactorToken, setTwoFactorToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (twoFactorToken) {
        await login2fa(twoFactorToken, code);
        const savedUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
        navigate(savedUser?.role === 'admin' ? '/admin' : '/client');
      } else {
        const result = await login(email, password);
        if (result.requires2fa) {
          setTwoFactorToken(result.twoFactorToken);
          toast('2FA code required', { icon: '🔐' });
        } else if (!result.success) {
          toast.error('Login failed. Check your credentials.');
        } else {
          const currentUser = user || JSON.parse(localStorage.getItem('auth_user') || '{}');
          navigate(currentUser?.role === 'admin' ? '/admin' : '/client');
        }
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fieldCls = 'w-full bg-[#0a0c12] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors';

  return (
    <div className="min-h-screen bg-[#0a0c12] flex flex-col">
      {/* Top nav */}
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

      {/* Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-sm text-slate-500">Sign in to your CloudPanel account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!twoFactorToken ? (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className={fieldCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={fieldCls}
                  />
                </div>
              </>
            ) : (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">2FA Code</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="6-digit code"
                  maxLength={6}
                  className={fieldCls}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              {twoFactorToken ? 'Verify Code' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-600 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
