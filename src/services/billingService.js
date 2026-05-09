import automationApi from '../lib/automationApi';

export const billingService = {
  clients: (params) => automationApi.get('/clients', { params }),
  client: (id) => automationApi.get(`/clients/${id}`),

  invoices: (params) => automationApi.get('/invoices', { params }),
  invoice: (id) => automationApi.get(`/invoices/${id}`),

  orders: (params) => automationApi.get('/orders', { params }),
  order: (id) => automationApi.get(`/orders/${id}`),

  domains: (params) => automationApi.get('/domains', { params }),
  domain: (id) => automationApi.get(`/domains/${id}`),

  tickets: (params) => automationApi.get('/support/tickets', { params }),
  ticket: (id) => automationApi.get(`/support/tickets/${id}`),
};
