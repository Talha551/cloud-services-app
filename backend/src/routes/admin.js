const express = require('express');
const db = require('../db/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Middleware to check admin role
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// === CLIENTS ===
router.get('/clients', authMiddleware, adminOnly, (req, res) => {
  const page = req.query.page || 1;
  const perPage = req.query.per_page || 20;

  db.all('SELECT id, email, name, status, created_at FROM users WHERE role = ?', ['client'], (err, clients) => {
    if (err) return res.status(500).json({ message: 'Error fetching clients' });
    res.json({ data: clients, meta: { total: clients.length, current_page: page, last_page: 1 } });
  });
});

router.get('/clients/:id', authMiddleware, adminOnly, (req, res) => {
  db.get('SELECT * FROM users WHERE id = ?', [req.params.id], (err, client) => {
    if (err) return res.status(500).json({ message: 'Error fetching client' });
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json({ data: client });
  });
});

// === INVOICES ===
router.get('/invoices', authMiddleware, adminOnly, (req, res) => {
  const page = req.query.page || 1;
  const perPage = req.query.per_page || 20;

  const query = `
    SELECT i.*, u.email as client_email, u.name as client_name
    FROM invoices i
    LEFT JOIN users u ON i.user_id = u.id
    ORDER BY i.created_at DESC
  `;

  db.all(query, (err, invoices) => {
    if (err) return res.status(500).json({ message: 'Error fetching invoices' });
    res.json({ data: invoices, meta: { total: invoices.length, current_page: page, last_page: 1 } });
  });
});

router.get('/invoices/:id', authMiddleware, adminOnly, (req, res) => {
  db.get('SELECT * FROM invoices WHERE id = ?', [req.params.id], (err, invoice) => {
    if (err) return res.status(500).json({ message: 'Error fetching invoice' });
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json({ data: invoice });
  });
});

// === ORDERS ===
router.get('/orders', authMiddleware, adminOnly, (req, res) => {
  const page = req.query.page || 1;
  const perPage = req.query.per_page || 20;

  const query = `
    SELECT o.*, u.email as client_email, u.name as client_name, p.name as product_name
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    LEFT JOIN plans p ON o.plan_id = p.id
    ORDER BY o.created_at DESC
  `;

  db.all(query, (err, orders) => {
    if (err) return res.status(500).json({ message: 'Error fetching orders' });
    res.json({ data: orders, meta: { total: orders.length, current_page: page, last_page: 1 } });
  });
});

router.get('/orders/:id', authMiddleware, adminOnly, (req, res) => {
  db.get('SELECT * FROM orders WHERE id = ?', [req.params.id], (err, order) => {
    if (err) return res.status(500).json({ message: 'Error fetching order' });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ data: order });
  });
});

// === DOMAINS ===
router.get('/domains', authMiddleware, adminOnly, (req, res) => {
  const page = req.query.page || 1;
  const perPage = req.query.per_page || 20;

  const query = `
    SELECT d.*, u.email as client_email, u.name as client_name
    FROM domains d
    LEFT JOIN users u ON d.user_id = u.id
    ORDER BY d.created_at DESC
  `;

  db.all(query, (err, domains) => {
    if (err) return res.status(500).json({ message: 'Error fetching domains' });
    res.json({ data: domains, meta: { total: domains.length, current_page: page, last_page: 1 } });
  });
});

router.get('/domains/:id', authMiddleware, adminOnly, (req, res) => {
  db.get('SELECT * FROM domains WHERE id = ?', [req.params.id], (err, domain) => {
    if (err) return res.status(500).json({ message: 'Error fetching domain' });
    if (!domain) return res.status(404).json({ message: 'Domain not found' });
    res.json({ data: domain });
  });
});

// === SUPPORT TICKETS ===
router.get('/support/tickets', authMiddleware, adminOnly, (req, res) => {
  const page = req.query.page || 1;
  const perPage = req.query.per_page || 20;

  const query = `
    SELECT t.*, u.email as client_email, u.name as client_name
    FROM tickets t
    LEFT JOIN users u ON t.user_id = u.id
    ORDER BY t.created_at DESC
  `;

  db.all(query, (err, tickets) => {
    if (err) return res.status(500).json({ message: 'Error fetching tickets' });
    res.json({ data: tickets, meta: { total: tickets.length, current_page: page, last_page: 1 } });
  });
});

router.get('/support/tickets/:id', authMiddleware, adminOnly, (req, res) => {
  db.get('SELECT * FROM tickets WHERE id = ?', [req.params.id], (err, ticket) => {
    if (err) return res.status(500).json({ message: 'Error fetching ticket' });
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    res.json({ data: ticket });
  });
});

module.exports = router;
