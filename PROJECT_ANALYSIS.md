# Project Analysis

## Current stack
- **Frontend:** React 19, TypeScript, Vite 8.
- **Package manager:** npm (`package-lock.json`).
- **Backend/database/authentication:** None. The repository has no API, database schema, ORM, or production authentication.

## Existing functionality
- The active `src/App.tsx` is a browser-only bank-management prototype using `localStorage` and hard-coded users/passwords.
- A separate set of storefront styles and a hero asset exist but are not used by the active banking application.

## Problems found
- The active application is unrelated to e-commerce and persists sensitive-looking banking demo data in the browser.
- Login uses plaintext passwords hard-coded in the frontend; there is no secure server-side authorization.
- There are no database constraints, server-side validation, checkout calculation, or persistent multi-user data.

## Recommended architecture
- Keep the Vite + React + TypeScript frontend and replace the banking prototype with an API-backed storefront/admin console.
- Add an Express + TypeScript REST API using Prisma and PostgreSQL. Use bcrypt password hashes and signed HTTP-only JWT cookies, Zod validation, Helmet, CORS, and rate limits.
- Keep business rules (pricing, tax, coupons, stock, order transactions) entirely on the server.

## Preserve
- `vite.config.ts`, TypeScript configuration, `src/assets/hero.png`, and the existing npm/Vite foundation.

## Modify
- `package.json`, `.gitignore`, `README.md`, `src/App.tsx`, `src/App.css`, and `src/index.css`.

## Create
- `server/` API modules, `prisma/schema.prisma`, migration and seed files, environment template, API documentation, project status, and critical API tests.
