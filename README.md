# IT Management Operations Dashboard

A polished frontend IT management web application built with **React + TypeScript + Vite**. It provides a responsive operations dashboard for internal IT teams using in-memory mock data.

## Features

- Responsive app shell with collapsible sidebar and top navigation bar
- Views for **Dashboard, Tickets, Devices, Users, and Reports**
- Dashboard KPI cards, trend chart, recent tickets, system health panel, quick actions
- Tickets search/filter by status and priority, create-ticket modal with validation, ticket detail modal with status updates
- Devices inventory table, search/filter, and add-device modal
- Users directory cards with status and device ownership info
- Reports summary cards and visualization panels for ticket resolution and device distribution
- Clear badges, empty states, and mobile-friendly layout

## Tech Stack

- React 19
- TypeScript
- Vite 8
- Oxlint

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Start development server

```bash
npm run dev
```

### 3) Build for production

```bash
npm run build
```

### 4) Lint

```bash
npm run lint
```

## Notes

- This project is frontend-only for demo purposes (no backend or authentication yet).
- All data lives in local state and `src/data/mockData.ts`.
