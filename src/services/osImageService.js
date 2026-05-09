import api from '../lib/api';

export const osImageService = {
  list: (params) => api.get('/os_images', { params }),
  get: (id) => api.get(`/os_images/${id}`),
  create: (data) => api.post('/os_images', data),
  update: (id, data) => api.put(`/os_images/${id}`, data),
  delete: (id) => api.delete(`/os_images/${id}`),
  versions: (id) => api.get(`/os_images/${id}/versions`),
  createVersion: (id, data) => api.post(`/os_images/${id}/versions`, data),
  deleteVersion: (id) => api.delete(`/os_image_versions/${id}`),
};
