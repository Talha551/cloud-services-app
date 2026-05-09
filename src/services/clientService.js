import automationApi from '../lib/automationApi';

export const clientService = {
  // Get current authenticated client profile
  profile: () => automationApi.get('/client/profile'),
  
  // Get client's services/products
  services: (params) => automationApi.get('/client/services', { params }),
  service: (id) => automationApi.get(`/client/services/${id}`),
  
  // Invoices for this client
  invoices: (params) => automationApi.get('/client/invoices', { params }),
  invoice: (id) => automationApi.get(`/client/invoices/${id}`),
  
  // Browse available plans
  plans: (params) => automationApi.get('/client/plans', { params }),
  
  // Place an order
  createOrder: (data) => automationApi.post('/client/orders', data),
  
  // Get order details
  orders: (params) => automationApi.get('/client/orders', { params }),
  order: (id) => automationApi.get(`/client/orders/${id}`),
  
  // VPS control (from client side)
  vpsStart: (id) => automationApi.post(`/client/services/${id}/start`),
  vpsStop: (id) => automationApi.post(`/client/services/${id}/stop`),
  vpsRestart: (id) => automationApi.post(`/client/services/${id}/restart`),
  vpsReinstall: (id, data) => automationApi.post(`/client/services/${id}/reinstall`, data),
  vpsConsole: (id) => automationApi.post(`/client/services/${id}/console`),
};
