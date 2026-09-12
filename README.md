# ITMANAGEMENT.COM
BANK MANAGEMENT SYSTEM

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Demo credentials

- `admin / admin`
- `manager / manager`
- `cashier / cashier`
- `csr / csr`

## Features

- Dashboard with live KPIs, recent transactions, and quick actions
- Customer management with CNIC validation, status control, and search/filtering
- Account opening with generated account numbers, mini statements, and status changes
- Deposit, withdrawal, transfer, printable receipt, and PDF receipt export
- CSR workspace for customer lookup, balance inquiry, transaction inquiry, and complaints/requests
- Reports for daily activity, deposits, withdrawals, accounts, customers, and savings interest projections
- Excel export (`.xlsx`) and PDF export for reports
- User management and audit logging with role-based access control
- Seeded realistic Pakistani demo data stored in localStorage

## Tech stack

- React 19 + TypeScript + Vite 8
- Tailwind CSS via `@tailwindcss/vite`
- `lucide-react` icons
- `date-fns` for date formatting/filtering
- `jspdf` + `html2canvas` for PDF export
- `write-excel-file` for secure `.xlsx` export
- LocalStorage persistence with seeded data

## Role access

- **admin** — full access to all modules
- **manager** — dashboard, customers, accounts, reports, users/audit (view users, no creation except admin)
- **cashier** — dashboard, accounts view, transactions, transaction history
- **csr** — dashboard, customers view, CSR workspace
