import { createContext, useContext, useState, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'));
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('auth_user')); } catch { return null; }
  });

  const login = useCallback(async (email, password) => {
    // DEMO MODE: use admin@demo.com / demo123 to bypass real API
    if (email === 'admin@demo.com' && password === 'demo123') {
      const demoToken = 'demo-token-12345';
      const demoUser = { id: 1, email: 'admin@demo.com', name: 'Demo Admin', roles: ['admin'] };
      localStorage.setItem('auth_token', demoToken);
      localStorage.setItem('auth_user', JSON.stringify(demoUser));
      setToken(demoToken);
      setUser(demoUser);
      return { success: true };
    }
    const data = await authService.login(email, password);
    // SolusVM returns { token, ... } or { two_factor_token } for 2FA
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.user || {}));
      setToken(data.token);
      setUser(data.user || {});
      return { success: true };
    }
    if (data.two_factor_token) {
      return { requires2fa: true, twoFactorToken: data.two_factor_token };
    }
    return { success: false };
  }, []);

  const login2fa = useCallback(async (twoFactorToken, code) => {
    const data = await authService.login2fa(twoFactorToken, code);
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('auth_user', JSON.stringify(data.user || {}));
    setToken(data.token);
    setUser(data.user || {});
  }, []);

  const logout = useCallback(async () => {
    try { await authService.logout(); } catch {}
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, login2fa, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
