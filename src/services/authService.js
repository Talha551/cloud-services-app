import axios from 'axios';

// Auth API uses /api/auth (not /api/v1)
const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:3001'
});

export const authService = {
  // --- Login / Session ---
  async login(email, password) {
    const { data } = await authApi.post('/api/auth/login', { email, password });
    return data;
  },
  async login2fa(token, code) {
    const { data } = await authApi.post('/api/auth/2fa/login', { token, code });
    return data;
  },
  async verify() {
    const { data } = await authApi.get('/api/auth');
    return data;
  },
  async logout() {
    await authApi.post('/api/auth/logout');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  },

  // --- Registration & Password ---
  async register(payload) {
    const { data } = await authApi.post('/api/auth/register', payload);
    return data;
  },
  async resetPassword(payload) {
    const { data } = await authApi.post('/api/auth/reset_password', payload);
    return data;
  },

  // --- API Tokens ---
  async createToken(name) {
    const { data } = await authApi.post('/api/auth/tokens', { name });
    return data;
  },
  async revokeToken(tokenId) {
    const { data } = await authApi.post('/api/auth/tokens/revoke', { token_id: tokenId });
    return data;
  },

  // --- Two-Factor Authentication ---
  async enable2fa() {
    const { data } = await authApi.post('/api/auth/2fa/enable');
    return data;
  },
  async disable2fa() {
    const { data } = await authApi.delete('/api/auth/2fa/disable');
    return data;
  },
  async create2faToken() {
    const { data } = await authApi.post('/api/auth/2fa/tokens');
    return data;
  },
  async generateRecoveryCodes() {
    const { data } = await api.post('/auth/2fa/recovery_codes');
    return data;
  },
  async get2faSecret() {
    const { data } = await api.get('/auth/2fa/secret');
    return data;
  },
};
