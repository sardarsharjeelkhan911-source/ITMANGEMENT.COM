# ITMANGEMENT Commerce

A full-stack, single-vendor commerce foundation with a responsive React storefront and a secure REST backend. Orders, inventory, product data, users, carts, and settings are persisted server-side; checkout totals and stock validation are never trusted from the browser.

## Stack
- React 19, TypeScript, Vite
- Node.js native HTTP REST service (dependency-free runtime fallback)
- PostgreSQL/Prisma production schema included in `prisma/schema.prisma`
- Signed, HTTP-only session tokens; Node `scrypt` password hashing

> **Development persistence:** Package installation was blocked by the execution environment's npm registry policy, so the runnable server uses a durable JSON store (`server/data/store.json`) without external dependencies. Its domain schema is mirrored in the provided PostgreSQL Prisma schema, ready to replace the store adapter when Prisma packages can be installed. This preserves a fully working local application now, while keeping production DB design explicit.

## Requirements
Node.js 20+ and npm. PostgreSQL 15+ is recommended for production.

## Installation & development
```bash
cp .env.example .env
# Set JWT_SECRET and ADMIN_EMAIL/ADMIN_PASSWORD before first server start.
npm install
npm run server       # API: http://localhost:4000
npm run dev          # UI: http://localhost:5173 (proxies /api to port 4000)
```
Use two terminals. On Windows PowerShell, use `Copy-Item .env.example .env` and start the same npm commands in separate VS Code terminals.

## Database / Prisma
The authoritative PostgreSQL model, indexes, relations, and constraints are in `prisma/schema.prisma`. Once registry access is available, install `prisma` and `@prisma/client`, then run:
```bash
npx prisma migrate dev --name initial
npx prisma generate
```
Set `DATABASE_URL` to your PostgreSQL connection string. Do not commit `.env`.

## Admin setup
Before the **first** API start, set `ADMIN_EMAIL`, `ADMIN_PASSWORD` (long unique password), and optionally `ADMIN_NAME`. The local persistent store creates the administrator only when it is first initialized. To reset development data, stop the API and delete `server/data/store.json`.

## Commands
```bash
npm run dev          # Vite frontend
npm run server       # API server
npm run build        # Type check and production frontend build
npm run lint         # Oxlint
npm run test:api     # Native API integration tests
```

## Security notes
Passwords are salted and scrypt-hashed; API responses omit password hashes. Session credentials are signed HTTP-only cookies with `SameSite=Lax` (and `Secure` in production). The server validates order inputs, recalculates prices/tax/shipping/coupons, checks inventory, protects admin routes, adds response security headers, and limits accepted request-body size.

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for endpoints and [PROJECT_STATUS.md](PROJECT_STATUS.md) for implementation status.
