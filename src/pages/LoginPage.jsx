import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Globe, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
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

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-3">
            <Globe size={22} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">CloudPanel</h1>
          <p className="text-sm text-slate-500 mt-1">SolusVM2 Management Platform</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-[#13151f] border border-[#2a2d3e] rounded-xl p-6 space-y-4">
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
                  className="w-full bg-[#0f1117] border border-[#2a2d3e] rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
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
                  className="w-full bg-[#0f1117] border border-[#2a2d3e] rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
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
                className="w-full bg-[#0f1117] border border-[#2a2d3e] rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {twoFactorToken ? 'Verify' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
