const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../db/database');

const router = express.Router();

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (!user) return res.status(401).json({ message: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });

    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    });
  });
});

// Register
router.post('/register', (req, res) => {
  const { email, password, first_name, last_name } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(
    'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
    [email, hashedPassword, `${first_name || ''} ${last_name || ''}`.trim() || email, 'client'],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(409).json({ message: 'Email already exists' });
        }
        return res.status(500).json({ message: 'Registration failed' });
      }

      const token = jwt.sign({ id: this.lastID, email }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });

      res.status(201).json({
        token,
        user: { id: this.lastID, email, name: `${first_name || ''} ${last_name || ''}`.trim(), role: 'client' }
      });
    }
  );
});

module.exports = router;
