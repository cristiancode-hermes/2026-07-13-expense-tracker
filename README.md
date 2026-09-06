# Hermes Expense Tracker

Multi-tenant expense tracking platform built with Angular 22 + NestJS 11.

## Quick Start

```bash
# Backend
cd apps/api
cp .env.example .env
npm run build && npm run start:dev
# Seed: SEED_DB=true npm run start:dev

# Frontend
cd apps/web
npm start
```

## Stack

- **Frontend:** Angular 22 (standalone, signals, zoneless, Tailwind v4)
- **Backend:** NestJS 11 with SQLite + better-sqlite3
- **Auth:** JWT with multi-tenant org isolation
- **Docs:** Swagger at /api/docs

## Features

- Multi-tenant auth with JWT
- Expense CRUD with category, status, receipt tracking
- Budget management with utilization tracking
- Dashboard with spending analytics and category breakdown
- Dark mode support via Tailwind `dark:` variants
