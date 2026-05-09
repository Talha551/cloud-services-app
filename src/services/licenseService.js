import api from '../lib/api';

export const licenseService = {
  // --- Standard License ---
  get: () => api.get('/license'),
  activate: (data) => api.post('/license/activate', data),
  refresh: () => api.post('/license/refresh'),

  // --- Solus License ---
  getSolus: () => api.get('/solus_license'),
  activateSolus: (data) => api.post('/solus_license/activate', data),
  listByType: () => api.get('/solus_license/compute_resources'),
  assignType: (data) => api.post('/solus_license/compute_resources', data),
  getStats: () => api.get('/solus_license/stats'),
  refreshSolus: () => api.post('/solus_license/refresh'),
  resetSolus: () => api.post('/solus_license/reset'),
};
