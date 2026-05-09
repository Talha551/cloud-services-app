const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const db = require('./db/database');
const initDB = require('./db/schema');
const seedDB = require('./db/seeder');

const authRoutes = require('./routes/auth');
const clientRoutes = require('./routes/client');
const adminRoutes = require('./routes/admin');
const authMiddleware = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3001;
const corsOrigin = process.env.CORS_ORIGIN;

// Middleware
app.use(cors(corsOrigin ? { origin: corsOrigin } : undefined));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize database
initDB();
seedDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/automation/v1/client', authMiddleware, clientRoutes);
app.use('/api/automation/v1', authMiddleware, adminRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`Database: SQLite`);
  console.log(`\n📚 API Endpoints:`);
  console.log(`  POST /api/auth/login`);
  console.log(`  POST /api/auth/register`);
  console.log(`  GET  /api/automation/v1/client/profile`);
  console.log(`  GET  /api/automation/v1/client/services`);
  console.log(`  GET  /api/automation/v1/client/invoices`);
  console.log(`  POST /api/automation/v1/client/orders`);
  console.log(`  GET  /api/automation/v1/clients (admin)`);
  console.log(`  GET  /api/automation/v1/invoices (admin)`);
  console.log(`  GET  /api/automation/v1/orders (admin)`);
  console.log(`  GET  /api/automation/v1/domains (admin)`);
  console.log(`  GET  /api/automation/v1/support/tickets (admin)`);
  console.log(`\n🔐 Demo Credentials:`);
  console.log(`  Admin: admin@demo.com / admin123`);
  console.log(`  Customer: customer1@example.com / customer123`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close();
  process.exit(0);
});
