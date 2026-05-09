# Cloud Services App (WHMCS-style + SolusVM2)

This project is a WHMCS-style control panel built on top of SolusVM2 APIs.

Goal:
- Use SolusVM2 API for virtualization and infrastructure operations.
- Use custom automation backend endpoints for WHMCS-like business logic (billing, invoices, orders, tickets, domains).
- Keep frontend fully API-driven.

## Architecture

Two API clients are used:

1. SolusVM API client
- File: src/lib/api.js
- Env: VITE_API_BASE_URL
- Used for: servers, plans, users, projects, locations, backups, IP blocks, compute resources.

2. Automation API client
- File: src/lib/automationApi.js
- Env: VITE_AUTOMATION_API_BASE_URL
- Used for: clients, invoices, orders, domains, support tickets.

This separation allows SolusVM for infra + custom backend for WHMCS-level workflows.

## Environment Variables

Configure these values in .env:

```env
VITE_API_BASE_URL=https://your-solusvm-host/api/v1
VITE_AUTOMATION_API_BASE_URL=https://your-backend.com/api/automation/v1
VITE_REGISTER_ENDPOINT=https://your-backend.com/api/register
```

## Current WHMCS-style Modules

Frontend pages wired:
- Clients
- Invoices
- Orders
- Domains
- Support Tickets

Service file:
- src/services/billingService.js

## Required Backend Endpoint Contract

Your automation backend should expose these endpoints:

### Clients
- GET /clients
- GET /clients/:id

### Invoices
- GET /invoices
- GET /invoices/:id

### Orders
- GET /orders
- GET /orders/:id

### Domains
- GET /domains
- GET /domains/:id

### Support
- GET /support/tickets
- GET /support/tickets/:id

Recommended response shape for list endpoints:

```json
{
	"data": [],
	"meta": {
		"current_page": 1,
		"last_page": 1,
		"total": 0
	}
}
```

## WHMCS Parity Roadmap

To reach full WHMCS-level functionality, backend must also implement:

1. Billing automation
- Recurring invoices
- Tax and credit handling
- Overdue reminders and dunning

2. Payment processing
- Gateway integrations (Stripe/PayPal, etc.)
- Webhooks and payment reconciliation

3. Order provisioning automation
- Order approve/reject
- Provision/suspend/terminate via SolusVM API
- Retry and job logs

4. Domain automation
- Register, renew, transfer
- Nameserver and lock management

5. Support workflow depth
- Ticket thread replies
- Attachments
- SLA and assignment queues

## Development

Install and run:

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```
