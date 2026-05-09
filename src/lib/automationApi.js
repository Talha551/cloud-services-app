import axios from 'axios';

const automationApi = axios.create({
  baseURL: import.meta.env.VITE_AUTOMATION_API_BASE_URL || '/api/automation/v1',
  headers: { 'Content-Type': 'application/json' },
});

automationApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

automationApi.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default automationApi;
