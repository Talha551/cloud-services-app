import api from '../lib/api';

export const userService = {
  list: (params) => api.get('/users', { params }),
  get: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  patch: (id, data) => api.patch(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  deleteMany: (ids) => api.delete('/users', { data: { ids } }),
  projects: (id) => api.get(`/users/${id}/projects`),
  tokens: (id) => api.get(`/users/${id}/tokens`),
  sendRecoveryCode: (id) => api.post(`/users/${id}/recovery_code`),
  createToken: (id) => api.post(`/users/${id}/tokens`),
};
