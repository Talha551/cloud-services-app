const express = require('express');
const db = require('../db/database');
const authMiddleware = require('../middleware/auth');
const { getConsoleUrlForService } = require('../services/solusvmConsoleService');

const router = express.Router();

// List plans for store/checkout
router.get('/plans', authMiddleware, (req, res) => {
  db.all('SELECT * FROM plans ORDER BY price ASC', (err, plans) => {
    if (err) return res.status(500).json({ message: 'Error fetching plans' });
    res.json({ data: plans, meta: { total: plans.length } });
  });
});

// Get client profile
router.get('/profile', authMiddleware, (req, res) => {
  db.get('SELECT id, email, name, role FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err) return res.status(500).json({ message: 'Error fetching profile' });
    res.json({ data: user });
  });
});

// Get client services
router.get('/services', authMiddleware, (req, res) => {
  const query = `
    SELECT s.*, p.vcpu, p.memory, p.disk, p.bandwidth, p.price
    FROM services s
    LEFT JOIN plans p ON s.plan_id = p.id
    WHERE s.user_id = ?
  `;

  db.all(query, [req.user.id], (err, services) => {
    if (err) return res.status(500).json({ message: 'Error fetching services' });

    // Get IPs for each service
    services.forEach(service => {
      db.all('SELECT * FROM ip_addresses WHERE service_id = ?', [service.id], (err, ips) => {
        service.ip_addresses = ips || [];
      });
    });

    res.json({ data: services, meta: { total: services.length } });
  });
});

// Get single service
router.get('/services/:id', authMiddleware, (req, res) => {
  const query = `
    SELECT s.*, p.vcpu, p.memory, p.disk, p.bandwidth, p.price, p.name as plan_name
    FROM services s
    LEFT JOIN plans p ON s.plan_id = p.id
    WHERE s.id = ? AND s.user_id = ?
  `;

  db.get(query, [req.params.id, req.user.id], (err, service) => {
    if (err) return res.status(500).json({ message: 'Error fetching service' });
    if (!service) return res.status(404).json({ message: 'Service not found' });

    db.all('SELECT * FROM ip_addresses WHERE service_id = ?', [service.id], (err, ips) => {
      service.ip_addresses = ips || [];
      res.json({ data: service });
    });
  });
});

// Create order
router.post('/orders', authMiddleware, (req, res) => {
  const { plan_id, hostname, location_id, os_id, billing_period } = req.body;

  db.get('SELECT price FROM plans WHERE id = ?', [plan_id], (err, plan) => {
    if (err || !plan) return res.status(404).json({ message: 'Plan not found' });

    db.run(
      'INSERT INTO orders (user_id, plan_id, total, status) VALUES (?, ?, ?, ?)',
      [req.user.id, plan_id, plan.price, 'pending'],
      function (err) {
        if (err) return res.status(500).json({ message: 'Error creating order' });

        // Create service
        db.run(
          'INSERT INTO services (user_id, plan_id, hostname, status, os, location) VALUES (?, ?, ?, ?, ?, ?)',
          [req.user.id, plan_id, hostname, 'active', `OS ${os_id}`, `Location ${location_id}`],
          function (err2) {
            if (err2) return res.status(500).json({ message: 'Error creating service' });

            // Add IP address
            const ip = `192.168.1.${Math.floor(Math.random() * 255)}`;
            db.run(
              'INSERT INTO ip_addresses (service_id, ip, type) VALUES (?, ?, ?)',
              [this.lastID, ip, 'primary'],
              (err3) => {
                if (err3) console.error('Error adding IP');
                res.status(201).json({ data: { id: this.lastID, status: 'success' } });
              }
            );
          }
        );
      }
    );
  });
});

// Get client orders
router.get('/orders', authMiddleware, (req, res) => {
  const query = `
    SELECT o.*, p.name as product_name, p.price
    FROM orders o
    LEFT JOIN plans p ON o.plan_id = p.id
    WHERE o.user_id = ?
  `;

  db.all(query, [req.user.id], (err, orders) => {
    if (err) return res.status(500).json({ message: 'Error fetching orders' });
    res.json({ data: orders, meta: { total: orders.length } });
  });
});

// Get client invoices
router.get('/invoices', authMiddleware, (req, res) => {
  db.all(
    'SELECT * FROM invoices WHERE user_id = ? ORDER BY created_at DESC',
    [req.user.id],
    (err, invoices) => {
      if (err) return res.status(500).json({ message: 'Error fetching invoices' });
      res.json({ data: invoices, meta: { total: invoices.length } });
    }
  );
});

// VPS control actions
router.post('/services/:id/start', authMiddleware, (req, res) => {
  db.run(
    'UPDATE services SET status = ? WHERE id = ? AND user_id = ?',
    ['running', req.params.id, req.user.id],
    function (err) {
      if (err) return res.status(500).json({ message: 'Error starting service' });
      if (this.changes === 0) return res.status(404).json({ message: 'Service not found' });
      res.json({ data: { status: 'success' } });
    }
  );
});

router.post('/services/:id/stop', authMiddleware, (req, res) => {
  db.run(
    'UPDATE services SET status = ? WHERE id = ? AND user_id = ?',
    ['stopped', req.params.id, req.user.id],
    function (err) {
      if (err) return res.status(500).json({ message: 'Error stopping service' });
      if (this.changes === 0) return res.status(404).json({ message: 'Service not found' });
      res.json({ data: { status: 'success' } });
    }
  );
});

router.post('/services/:id/restart', authMiddleware, (req, res) => {
  db.run(
    'UPDATE services SET status = ? WHERE id = ? AND user_id = ?',
    ['running', req.params.id, req.user.id],
    function (err) {
      if (err) return res.status(500).json({ message: 'Error restarting service' });
      if (this.changes === 0) return res.status(404).json({ message: 'Service not found' });
      res.json({ data: { status: 'success' } });
    }
  );
});

router.post('/services/:id/console', authMiddleware, (req, res) => {
  db.get(
    'SELECT id, user_id, hostname, external_id FROM services WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.id],
    async (err, service) => {
      if (err) return res.status(500).json({ message: 'Error loading service for console' });
      if (!service) return res.status(404).json({ message: 'Service not found' });

      try {
        const { providerConsoleUrl, instanceId } = await getConsoleUrlForService(service);
        // Keep both legacy and nested keys for compatibility with older frontend builds.
        res.json({
          data: { url: providerConsoleUrl, console_url: providerConsoleUrl, instance_id: instanceId },
          url: providerConsoleUrl,
          console_url: providerConsoleUrl,
          instance_id: instanceId,
        });
      } catch (providerErr) {
        const statusCode = Number(providerErr.status) || 502;
        res.status(statusCode).json({ message: providerErr.message || 'Failed to generate console URL' });
      }
    }
  );
});

router.post('/services/:id/reinstall', authMiddleware, (req, res) => {
  const { os_id } = req.body;
  db.run(
    'UPDATE services SET os = ? WHERE id = ? AND user_id = ?',
    [`OS ${os_id}`, req.params.id, req.user.id],
    function (err) {
      if (err) return res.status(500).json({ message: 'Error reinstalling OS' });
      if (this.changes === 0) return res.status(404).json({ message: 'Service not found' });
      res.json({ data: { status: 'success' } });
    }
  );
});

module.exports = router;
