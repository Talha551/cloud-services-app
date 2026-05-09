const express = require('express');

const router = express.Router();

const nowIso = () => new Date().toISOString();

const seedServers = [
  {
    id: 101,
    name: 'web-prod-01',
    status: 'running',
    ip: '185.12.44.10',
    description: 'Main production web server',
    virtualization_type: 'kvm',
    created_at: nowIso(),
    os_image_version: { os_image: { name: 'Ubuntu 22.04 LTS' } },
    plan: { id: 2, name: 'Pro 4', vcpu: 4, memory: 8192, disk: 160, bandwidth: 4000 },
    location: { id: 1, name: 'Frankfurt' },
    ip_addresses: [{ id: 1, ip: '185.12.44.10', type: 'public' }],
  },
  {
    id: 102,
    name: 'db-primary-01',
    status: 'running',
    ip: '185.12.44.11',
    description: 'Primary database node',
    virtualization_type: 'kvm',
    created_at: nowIso(),
    os_image_version: { os_image: { name: 'Debian 12' } },
    plan: { id: 3, name: 'Business 8', vcpu: 8, memory: 16384, disk: 320, bandwidth: 8000 },
    location: { id: 2, name: 'Amsterdam' },
    ip_addresses: [{ id: 2, ip: '185.12.44.11', type: 'public' }],
  },
  {
    id: 103,
    name: 'staging-api-01',
    status: 'stopped',
    ip: '185.12.44.12',
    description: 'Staging API node',
    virtualization_type: 'kvm',
    created_at: nowIso(),
    os_image_version: { os_image: { name: 'Ubuntu 20.04 LTS' } },
    plan: { id: 1, name: 'Starter 2', vcpu: 2, memory: 4096, disk: 80, bandwidth: 2000 },
    location: { id: 1, name: 'Frankfurt' },
    ip_addresses: [{ id: 3, ip: '185.12.44.12', type: 'public' }],
  },
];

const seedPlans = [
  { id: 1, name: 'Starter 2', vcpu: 2, memory: 4096, disk: 80, bandwidth: 2000, price: 8 },
  { id: 2, name: 'Pro 4', vcpu: 4, memory: 8192, disk: 160, bandwidth: 4000, price: 16 },
  { id: 3, name: 'Business 8', vcpu: 8, memory: 16384, disk: 320, bandwidth: 8000, price: 34 },
];

const seedUsers = [
  { id: 1, name: 'Talha Admin', email: 'admin@demo.com', role: 'admin', status: 'active', created_at: nowIso() },
  { id: 2, name: 'Customer One', email: 'customer1@example.com', role: 'client', status: 'active', created_at: nowIso() },
  { id: 3, name: 'Customer Two', email: 'customer2@example.com', role: 'client', status: 'active', created_at: nowIso() },
];

const seedLocations = [
  { id: 1, name: 'Frankfurt', country: 'Germany', code: 'DE-FRA' },
  { id: 2, name: 'Amsterdam', country: 'Netherlands', code: 'NL-AMS' },
  { id: 3, name: 'London', country: 'United Kingdom', code: 'UK-LON' },
];

const seedOsImages = [
  { id: 1, name: 'Ubuntu 22.04 LTS', status: 'active' },
  { id: 2, name: 'Debian 12', status: 'active' },
  { id: 3, name: 'AlmaLinux 9', status: 'active' },
];

const seedProjects = [
  { id: 1, name: 'Production', description: 'Primary production workloads', created_at: nowIso() },
  { id: 2, name: 'Staging', description: 'Pre-production testing', created_at: nowIso() },
];

const seedIpBlocks = [
  { id: 1, cidr: '185.12.44.0/24', type: 'public', status: 'active', ips_total: 254, ips_used: 16 },
  { id: 2, cidr: '10.10.0.0/24', type: 'private', status: 'active', ips_total: 254, ips_used: 8 },
];

const seedComputeResources = [
  { id: 1, name: 'Compute Cluster A', cpu_total: 64, cpu_used: 23, memory_total: 262144, memory_used: 112640 },
  { id: 2, name: 'Compute Cluster B', cpu_total: 128, cpu_used: 61, memory_total: 524288, memory_used: 294912 },
];

const seedRoles = [
  { id: 1, name: 'admin', description: 'Full access' },
  { id: 2, name: 'client', description: 'Client access' },
];

const seedPermissions = [
  { id: 1, key: 'servers.read', label: 'View servers' },
  { id: 2, key: 'servers.write', label: 'Manage servers' },
  { id: 3, key: 'users.read', label: 'View users' },
];

const seedBackups = [
  { id: 1, name: 'Daily Backup #1', created_at: nowIso() },
  { id: 2, name: 'Daily Backup #2', created_at: nowIso() },
  { id: 3, name: 'Daily Backup #3', created_at: nowIso() },
];

const seedSnapshots = [
  { id: 1, name: 'Snapshot A', created_at: nowIso() },
  { id: 2, name: 'Snapshot B', created_at: nowIso() },
];

function withMeta(items) {
  return {
    data: items,
    meta: {
      total: items.length,
      current_page: 1,
      last_page: 1,
      generated_at: nowIso(),
    },
  };
}

function single(item) {
  return { data: item, generated_at: nowIso() };
}

function success(message = 'Action completed') {
  return {
    data: {
      status: 'success',
      message,
      updated_at: nowIso(),
    },
  };
}

function parsePath(path) {
  return path.split('?')[0].split('/').filter(Boolean);
}

router.all('*', (req, res) => {
  const parts = parsePath(req.path);
  const [resource, id, sub] = parts;
  const method = req.method.toUpperCase();

  if (resource === 'servers') {
    if (method === 'GET' && !id) return res.json(withMeta(seedServers));
    if (method === 'GET' && id && !sub) {
      const found = seedServers.find(s => String(s.id) === id) || seedServers[0];
      return res.json(single(found));
    }
    if (method === 'GET' && id && (sub === 'backups' || sub === 'snapshots')) {
      return res.json({ data: sub === 'backups' ? seedBackups : seedSnapshots });
    }
    if (method === 'GET' && id && sub === 'ips') {
      return res.json({ data: (seedServers.find(s => String(s.id) === id) || seedServers[0]).ip_addresses });
    }
    if (method === 'GET' && id && (sub === 'disks' || sub === 'settings' || sub === 'limits')) {
      return res.json({ data: [{ id: 1, key: sub, value: 'mock' }] });
    }
    if (method === 'POST' && id && sub === 'vnc_up') {
      return res.json({ url: 'https://console.example.com/mock-session', generated_at: nowIso() });
    }
    if (['POST', 'PATCH', 'DELETE'].includes(method)) return res.json(success('Server operation completed (mock)'));
  }

  if (resource === 'plans') {
    if (method === 'GET' && !id) return res.json(withMeta(seedPlans));
    if (method === 'GET' && id) return res.json(single(seedPlans.find(p => String(p.id) === id) || seedPlans[0]));
    if (['POST', 'PATCH', 'DELETE'].includes(method)) return res.json(success('Plan operation completed (mock)'));
  }

  if (resource === 'users') {
    if (method === 'GET' && !id) return res.json(withMeta(seedUsers));
    if (method === 'GET' && id && !sub) return res.json(single(seedUsers.find(u => String(u.id) === id) || seedUsers[0]));
    if (method === 'GET' && id && (sub === 'projects' || sub === 'tokens')) return res.json({ data: [] });
    if (['POST', 'PATCH', 'DELETE'].includes(method)) return res.json(success('User operation completed (mock)'));
  }

  if (resource === 'locations') {
    if (method === 'GET' && !id) return res.json(withMeta(seedLocations));
    if (method === 'GET' && id) return res.json(single(seedLocations.find(l => String(l.id) === id) || seedLocations[0]));
    if (['POST', 'PATCH', 'DELETE'].includes(method)) return res.json(success('Location operation completed (mock)'));
  }

  if (resource === 'os_images') {
    if (method === 'GET' && !id) return res.json(withMeta(seedOsImages));
    if (method === 'GET' && id && !sub) return res.json(single(seedOsImages.find(o => String(o.id) === id) || seedOsImages[0]));
    if (method === 'GET' && id && sub === 'versions') return res.json({ data: [{ id: 1, version: 'v1', status: 'active' }] });
    if (['POST', 'PATCH', 'DELETE'].includes(method)) return res.json(success('OS image operation completed (mock)'));
  }

  if (resource === 'projects') {
    if (method === 'GET' && !id) return res.json(withMeta(seedProjects));
    if (method === 'GET' && id && !sub) return res.json(single(seedProjects.find(p => String(p.id) === id) || seedProjects[0]));
    if (method === 'GET' && id && sub === 'servers') return res.json({ data: seedServers });
    if (method === 'GET' && id && (sub === 'members' || sub === 'ssh_keys')) return res.json({ data: [] });
    if (['POST', 'PATCH', 'DELETE'].includes(method)) return res.json(success('Project operation completed (mock)'));
  }

  if (resource === 'backups') {
    if (method === 'GET') return res.json(withMeta(seedBackups));
    if (['POST', 'PATCH', 'DELETE'].includes(method)) return res.json(success('Backup operation completed (mock)'));
  }

  if (resource === 'snapshots') {
    if (method === 'GET') return res.json(withMeta(seedSnapshots));
    if (['POST', 'PATCH', 'DELETE'].includes(method)) return res.json(success('Snapshot operation completed (mock)'));
  }

  if (resource === 'ip_blocks') {
    if (method === 'GET' && !id) return res.json(withMeta(seedIpBlocks));
    if (method === 'GET' && id && !sub) return res.json(single(seedIpBlocks.find(i => String(i.id) === id) || seedIpBlocks[0]));
    if (method === 'GET' && id && sub === 'ips') return res.json({ data: [{ id: 1, ip: '185.12.44.21', status: 'reserved' }] });
    if (['POST', 'PATCH', 'DELETE'].includes(method)) return res.json(success('IP block operation completed (mock)'));
  }

  if (resource === 'ips') {
    if (method === 'GET') return res.json(withMeta([{ id: 1, ip: '185.12.44.21', status: 'reserved' }]));
    if (['POST', 'PATCH', 'DELETE'].includes(method)) return res.json(success('IP operation completed (mock)'));
  }

  if (resource === 'vlans') {
    if (method === 'GET') return res.json(withMeta([{ id: 1, name: 'VLAN-100', cidr: '10.100.0.0/24' }]));
    if (['POST', 'PATCH', 'DELETE'].includes(method)) return res.json(success('VLAN operation completed (mock)'));
  }

  if (resource === 'compute_resources') {
    if (method === 'GET' && !id) return res.json(withMeta(seedComputeResources));
    if (method === 'GET' && id) return res.json(single(seedComputeResources.find(c => String(c.id) === id) || seedComputeResources[0]));
  }

  if (resource === 'usage') {
    if (method === 'GET' && !id) {
      return res.json({
        data: {
          cpu_used_percent: 47,
          memory_used_percent: 56,
          disk_used_percent: 61,
          generated_at: nowIso(),
        },
      });
    }
    if (method === 'GET') return res.json({ data: [{ ts: nowIso(), value: Math.floor(Math.random() * 90) + 5 }] });
  }

  if (resource === 'roles') {
    if (method === 'GET' && !id) return res.json(withMeta(seedRoles));
    if (method === 'GET' && id) return res.json(single(seedRoles.find(r => String(r.id) === id) || seedRoles[0]));
    if (['POST', 'PATCH', 'DELETE'].includes(method)) return res.json(success('Role operation completed (mock)'));
  }

  if (resource === 'permissions' && method === 'GET') {
    return res.json({ data: seedPermissions });
  }

  if (resource === 'limit_groups') {
    if (method === 'GET' && !id) {
      return res.json(withMeta([
        { id: 1, name: 'Default Limits', cpu_limit: 100, memory_limit: 100 },
        { id: 2, name: 'Strict Limits', cpu_limit: 70, memory_limit: 70 },
      ]));
    }
    if (method === 'GET' && id) return res.json(single({ id: Number(id), name: 'Default Limits', cpu_limit: 100, memory_limit: 100 }));
    if (['POST', 'PATCH', 'DELETE'].includes(method)) return res.json(success('Limit group operation completed (mock)'));
  }

  if (resource === 'account') {
    if (method === 'GET' && !id) {
      return res.json({
        data: {
          id: req.user?.id || 1,
          name: req.user?.name || 'Demo User',
          email: req.user?.email || 'demo@example.com',
          role: req.user?.role || 'admin',
        },
      });
    }
    if (method === 'PATCH') return res.json(success('Account updated (mock)'));
    if (method === 'GET' && id === 'notifications') return res.json({ data: [] });
    if (method === 'DELETE' && id === 'notifications') return res.json(success('Notifications cleared (mock)'));
    if (id === 'tokens') {
      if (method === 'GET') return res.json({ data: [{ id: 1, name: 'Default token', created_at: nowIso() }] });
      if (method === 'POST') return res.json({ data: { id: Date.now(), token: 'mock_token_' + Date.now() } });
    }
  }

  if (resource === 'license' || resource === 'solus_license') {
    if (method === 'GET') {
      return res.json({
        data: {
          status: 'active',
          key: 'XXXX-XXXX-MOCK',
          expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
          generated_at: nowIso(),
        },
      });
    }
    return res.json(success('License operation completed (mock)'));
  }

  if (resource === 'auth' && id === '2fa') {
    if (sub === 'secret' && method === 'GET') return res.json({ data: { secret: 'MOCK2FASECRET', qr_code: null } });
    if (sub === 'recovery_codes' && method === 'POST') return res.json({ data: { codes: ['A1B2-C3D4', 'E5F6-G7H8'] } });
  }

  return res.json(success('Mock endpoint response')); 
});

module.exports = router;
