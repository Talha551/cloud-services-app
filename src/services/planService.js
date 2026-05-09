import api from '../lib/api';

export const planService = {
  list: (params) => api.get('/plans', { params }),
  get: (id) => api.get(`/plans/${id}`),
  create: (data) => api.post('/plans', data),
  update: (id, data) => api.put(`/plans/${id}`, data),
  delete: (id) => api.delete(`/plans/${id}`),
  deleteMany: (ids) => api.delete('/plans', { data: { ids } }),
};
