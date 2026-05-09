import api from '../lib/api';

export const locationService = {
  list: (params) => api.get('/locations', { params }),
  get: (id) => api.get(`/locations/${id}`),
  create: (data) => api.post('/locations', data),
  update: (id, data) => api.put(`/locations/${id}`, data),
  delete: (id) => api.delete(`/locations/${id}`),
};

export const projectService = {
  list: (params) => api.get('/projects', { params }),
  get: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  join: (id) => api.post(`/projects/${id}/join`),
  leave: (id) => api.post(`/projects/${id}/leave`),
  servers: (id) => api.get(`/projects/${id}/servers`),
  createServer: (id, data) => api.post(`/projects/${id}/servers`, data),
  members: (id) => api.get(`/projects/${id}/members`),
  addMember: (id, data) => api.post(`/projects/${id}/members`, data),
  removeMember: (id, memberId) => api.delete(`/projects/${id}/members/${memberId}`),
  resendInvitation: (id, memberId) => api.post(`/projects/${id}/members/${memberId}/resend`),
  sshKeys: (id) => api.get(`/projects/${id}/ssh_keys`),
  createSshKey: (id, data) => api.post(`/projects/${id}/ssh_keys`, data),
};

export const backupService = {
  list: () => api.get('/backups'),
  get: (id) => api.get(`/backups/${id}`),
  delete: (id) => api.delete(`/backups/${id}`),
  restore: (id) => api.post(`/backups/${id}/restore`),
};

export const snapshotService = {
  revert: (id) => api.post(`/snapshots/${id}/revert`),
  delete: (id) => api.delete(`/snapshots/${id}`),
};

export const ipBlockService = {
  list: (params) => api.get('/ip_blocks', { params }),
  get: (id) => api.get(`/ip_blocks/${id}`),
  create: (data) => api.post('/ip_blocks', data),
  update: (id, data) => api.put(`/ip_blocks/${id}`, data),
  delete: (id) => api.delete(`/ip_blocks/${id}`),
  deleteMany: (ids) => api.delete('/ip_blocks', { data: { ids } }),
  addIp: (id, data) => api.post(`/ip_blocks/${id}/add_ip`, data),
  addIps: (id, data) => api.post(`/ip_blocks/${id}/add_ips`, data),
  ips: (id) => api.get(`/ip_blocks/${id}/ips`),
  listReserved: () => api.get('/ips'),
  reserve: (data) => api.post('/ips', data),
};

export const ipService = {
  freeMany: (ids) => api.delete('/ips', { data: { ids } }),
  free: (id) => api.delete(`/ips/${id}`),
  patch: (id, data) => api.patch(`/ips/${id}`, data),
};

export const vlanService = {
  list: (params) => api.get('/vlans', { params }),
  get: (id) => api.get(`/vlans/${id}`),
  create: (data) => api.post('/vlans', data),
  update: (id, data) => api.put(`/vlans/${id}`, data),
  delete: (id) => api.delete(`/vlans/${id}`),
};

export const computeResourceService = {
  list: () => api.get('/compute_resources'),
  get: (id) => api.get(`/compute_resources/${id}`),
};

export const usageService = {
  summary: () => api.get('/usage'),
  cpu: (uuid) => api.get(`/usage/cpu/${uuid}`),
  memory: (uuid) => api.get(`/usage/memory/${uuid}`),
  network: (uuid) => api.get(`/usage/network/${uuid}`),
  disks: (uuid) => api.get(`/usage/disks/${uuid}`),
};
