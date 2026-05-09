# Cloud Services Backend

Node.js + Express + SQLite backend for CloudPanel WHMCS-style platform.

## Deploy Backend On Render

Use the root-level file `render.yaml` for one-click service setup.

1. Push this project to GitHub.
2. In Render, choose New + Blueprint.
3. Select your repository.
4. Render will detect `render.yaml` and create `cloud-services-backend`.
5. In service env vars, set `CORS_ORIGIN` to your frontend domain (example: `https://cservice.unaux.com`).
6. Deploy and copy your backend URL (example: `https://cloud-services-backend.onrender.com`).

After backend is live, update frontend `.env` in project root:

```env
VITE_API_BASE_URL=https://cloud-services-backend.onrender.com/api/v1
VITE_AUTOMATION_API_BASE_URL=https://cloud-services-backend.onrender.com/api/automation/v1
VITE_REGISTER_ENDPOINT=https://cloud-services-backend.onrender.com/api/auth/register
VITE_BASE_PATH=/
```

Then rebuild frontend and upload only `dist` contents to your static host.

## Setup

```bash
npm install
```

## Run

Development:
```bash
npm run dev
```

Production:
```bash
npm start
```

Backend runs on: http://localhost:3001

## Features

- ✅ Authentication (JWT)
- ✅ Client services management
- ✅ Order management
- ✅ Invoice tracking
- ✅ Ticket support system
- ✅ Domain management
- ✅ Admin dashboard endpoints

## Demo Credentials

**Admin:**
- Email: admin@demo.com
- Password: admin123

**Customer:**
- Email: customer1@example.com
- Password: customer123

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register new account

### Client Routes (Require Auth)
- `GET /api/automation/v1/client/profile` - Get profile
- `GET /api/automation/v1/client/services` - List services
- `GET /api/automation/v1/client/services/:id` - Get service details
- `POST /api/automation/v1/client/orders` - Create order
- `GET /api/automation/v1/client/orders` - Get orders
- `GET /api/automation/v1/client/invoices` - Get invoices
- `POST /api/automation/v1/client/services/:id/start` - Start VPS
- `POST /api/automation/v1/client/services/:id/stop` - Stop VPS
- `POST /api/automation/v1/client/services/:id/restart` - Restart VPS
- `POST /api/automation/v1/client/services/:id/console` - Get console URL
- `POST /api/automation/v1/client/services/:id/reinstall` - Reinstall OS

## Real SolusVM Console Setup

Configure these variables in `backend/.env`:

- `SOLUSVM_API_BASE_URL` (example: `https://panel.example.com/api/v1`)
- `SOLUSVM_API_TOKEN`
- `SOLUSVM_AUTH_HEADER` (default: `Authorization`)
- `SOLUSVM_AUTH_PREFIX` (default: `Bearer`)
- `SOLUSVM_CONSOLE_PATH_TEMPLATE` (default: `/instances/{instanceId}/console`)
- `SOLUSVM_CONSOLE_METHOD` (default: `POST`)
- `SOLUSVM_CONSOLE_URL_FIELD` (optional JSON path to URL in provider response)
- `SOLUSVM_LOOKUP_ENABLED` (default: `true`)
- `SOLUSVM_LOOKUP_PATH_TEMPLATE` (default: `/instances?search={hostname}`)
- `SOLUSVM_LOOKUP_METHOD` (default: `GET`)
- `SOLUSVM_LOOKUP_INSTANCE_ID_FIELD` (optional JSON path to instance ID)

Quick start (recommended):

1. Set only `SOLUSVM_API_BASE_URL` and `SOLUSVM_API_TOKEN` first.
2. Keep `SOLUSVM_CONSOLE_PATH_TEMPLATE` and `SOLUSVM_LOOKUP_PATH_TEMPLATE` empty.
3. Backend will auto-try common SolusVM endpoint patterns for lookup and console URL.
4. If your provider uses custom paths, set the templates explicitly.

How instance ID is resolved:

1. Uses `services.external_id` if present.
2. If empty and lookup is enabled, queries SolusVM using hostname lookup template.

The console endpoint returns provider URL in both legacy and nested keys:

- `url`
- `console_url`
- `data.url`
- `data.console_url`

### Admin Routes (Require Auth + Admin Role)
- `GET /api/automation/v1/clients` - List all clients
- `GET /api/automation/v1/clients/:id` - Get client details
- `GET /api/automation/v1/invoices` - List invoices
- `GET /api/automation/v1/invoices/:id` - Get invoice details
- `GET /api/automation/v1/orders` - List orders
- `GET /api/automation/v1/orders/:id` - Get order details
- `GET /api/automation/v1/domains` - List domains
- `GET /api/automation/v1/domains/:id` - Get domain details
- `GET /api/automation/v1/support/tickets` - List tickets
- `GET /api/automation/v1/support/tickets/:id` - Get ticket details

## Database

SQLite database auto-created in `data/app.db` with:
- Users
- Plans
- Services (VPS)
- IP Addresses
- Invoices
- Orders
- Tickets
- Domains

Auto-seeded with demo data on first run.
