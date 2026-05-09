import api from '../lib/api';

export const permissionService = {
  list: () => api.get('/permissions'),
};

export const roleService = {
  list: (params) => api.get('/roles', { params }),
  get: (id) => api.get(`/roles/${id}`),
  create: (data) => api.post('/roles', data),
  update: (id, data) => api.put(`/roles/${id}`, data),
  delete: (id) => api.delete(`/roles/${id}`),
};
