import api from '../lib/api';

export const accountService = {
  // --- Account Info ---
  get: () => api.get('/account'),
  update: (data) => api.patch('/account', data),

  // --- Notifications ---
  listNotifications: (params) => api.get('/account/notifications', { params }),
  deleteNotifications: (ids) => api.delete('/account/notifications', { data: { ids } }),

  // --- API Tokens ---
  listTokens: () => api.get('/account/tokens'),
  createToken: (name) => api.post('/account/tokens', { name }),
};
