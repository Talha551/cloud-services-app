import api from '../lib/api';

export const limitGroupService = {
  list: (params) => api.get('/limit_groups', { params }),
  get: (id) => api.get(`/limit_groups/${id}`),
  create: (data) => api.post('/limit_groups', data),
  update: (id, data) => api.put(`/limit_groups/${id}`, data),
  delete: (id) => api.delete(`/limit_groups/${id}`),
};
