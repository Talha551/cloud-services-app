const db = require('./database');
const bcrypt = require('bcryptjs');

const seedDB = () => {
  db.serialize(() => {
    // Clear existing data
    db.run('DELETE FROM ip_addresses');
    db.run('DELETE FROM services');
    db.run('DELETE FROM orders');
    db.run('DELETE FROM invoices');
    db.run('DELETE FROM tickets');
    db.run('DELETE FROM domains');
    db.run('DELETE FROM plans');
    db.run('DELETE FROM users');

    // Insert plans
    const plans = [
      { name: 'Starter', vcpu: 1, memory: 1024, disk: 25, bandwidth: 1000, price: 5.99, virtualization_type: 'KVM' },
      { name: 'Professional', vcpu: 2, memory: 2048, disk: 50, bandwidth: 2000, price: 9.99, virtualization_type: 'KVM' },
      { name: 'Business', vcpu: 4, memory: 4096, disk: 100, bandwidth: 5000, price: 19.99, virtualization_type: 'KVM' },
      { name: 'Enterprise', vcpu: 8, memory: 8192, disk: 250, bandwidth: 10000, price: 39.99, virtualization_type: 'KVM' },
    ];

    plans.forEach((plan) => {
      db.run(
        'INSERT INTO plans (name, vcpu, memory, disk, bandwidth, price, virtualization_type) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [plan.name, plan.vcpu, plan.memory, plan.disk, plan.bandwidth, plan.price, plan.virtualization_type]
      );
    });

    // Insert users (admin and customers)
    const adminPass = bcrypt.hashSync('admin123', 10);
    const customerPass = bcrypt.hashSync('customer123', 10);

    db.run(
      'INSERT INTO users (email, password, name, role, status) VALUES (?, ?, ?, ?, ?)',
      ['admin@demo.com', adminPass, 'Demo Admin', 'admin', 'active']
    );

    // Insert customers
    const customers = [
      { email: 'customer1@example.com', name: 'John Doe', password: customerPass },
      { email: 'customer2@example.com', name: 'Jane Smith', password: customerPass },
      { email: 'customer3@example.com', name: 'Bob Johnson', password: customerPass },
    ];

    let customerIds = [];
    customers.forEach((customer) => {
      db.run(
        'INSERT INTO users (email, password, name, role, status) VALUES (?, ?, ?, ?, ?)',
        [customer.email, customer.password, customer.name, 'client', 'active'],
        function () {
          customerIds.push(this.lastID);

          // Add sample services for first two customers
          if (customerIds.length <= 2) {
            db.run(
              'INSERT INTO services (user_id, plan_id, hostname, status, os, location) VALUES (?, ?, ?, ?, ?, ?)',
              [this.lastID, 1, `server${this.lastID}.example.com`, 'running', 'Ubuntu 22.04', 'USA - New York'],
              function (serviceId) {
                const serviceLastId = this.lastID;
                // Add IP address
                db.run(
                  'INSERT INTO ip_addresses (service_id, ip, type) VALUES (?, ?, ?)',
                  [serviceLastId, `192.168.1.${10 + serviceLastId}`, 'primary']
                );

                // Add sample invoice
                db.run(
                  'INSERT INTO invoices (user_id, total, status, due_date) VALUES (?, ?, ?, date("now", "+30 days"))',
                  [this.lastID, 5.99, 'pending']
                );
              }
            );
          }
        }
      );
    });

    // Add sample orders
    setTimeout(() => {
      db.all('SELECT id FROM users WHERE role = ?', ['client'], (err, users) => {
        if (users && users.length > 0) {
          users.forEach((user, idx) => {
            if (idx < 2) {
              db.run(
                'INSERT INTO orders (user_id, plan_id, total, status) VALUES (?, ?, ?, ?)',
                [user.id, 2, 9.99, 'completed']
              );
            }
          });
        }
      });
    }, 500);

    // Add sample tickets
    setTimeout(() => {
      db.all('SELECT id FROM users WHERE role = ?', ['client'], (err, users) => {
        if (users && users.length > 0) {
          db.run(
            'INSERT INTO tickets (user_id, subject, description, status, priority) VALUES (?, ?, ?, ?, ?)',
            [users[0].id, 'Cannot SSH into server', 'Getting connection timeout errors', 'open', 'high']
          );
          db.run(
            'INSERT INTO tickets (user_id, subject, description, status, priority) VALUES (?, ?, ?, ?, ?)',
            [users[1].id, 'Billing inquiry', 'Need invoice for last month', 'resolved', 'normal']
          );
        }
      });
    }, 1000);

    // Add sample domains
    setTimeout(() => {
      db.all('SELECT id FROM users WHERE role = ?', ['client'], (err, users) => {
        if (users && users.length > 0) {
          db.run(
            'INSERT INTO domains (user_id, domain, registrar, expires_at, auto_renew, status) VALUES (?, ?, ?, date("now", "+365 days"), ?, ?)',
            [users[0].id, 'example.com', 'Namecheap', 1, 'active']
          );
        }
      });
    }, 1500);

    console.log('Database seeded successfully');
  });
};

module.exports = seedDB;
