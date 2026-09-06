# Hermes Expense Tracker — Architecture

## Overview

Multi-tenant expense tracking platform built with Angular 22 + NestJS 11 monorepo.
Organizations track expenses, manage budgets by category, and view spending analytics.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 22 (standalone, signals, zoneless) |
| Backend | NestJS 11 (modules, guards, Swagger) |
| Database | SQLite (dev) / Neon PostgreSQL (prod) |
| Styling | Tailwind CSS v4 |
| Auth | JWT with multi-tenant org isolation |

## Project Structure

```
2026-07-13-expense-tracker/
├── apps/
│   ├── api/                  # NestJS backend
│   │   ├── src/
│   │   │   ├── auth/         # JWT auth (login, register, guard, strategy)
│   │   │   ├── database/     # SQLite database service (raw queries)
│   │   │   ├── organizations/# Org CRUD
│   │   │   ├── users/        # User CRUD
│   │   │   ├── categories/   # Expense categories with icons/colors
│   │   │   ├── expenses/     # Expense CRUD + dashboard stats
│   │   │   ├── budgets/      # Budget CRUD + budget-vs-actual analysis
│   │   │   ├── receipts/     # Receipt metadata
│   │   │   ├── seed/         # Seed data with 2 orgs, 3 users, 10 expenses
│   │   │   ├── app.module.ts # Root module
│   │   │   └── main.ts       # Bootstrap + Swagger + CORS
│   │   ├── .env
│   │   └── .env.example
│   └── web/                  # Angular 22 frontend
│       └── src/app/
│           ├── models/       # TypeScript interfaces
│           ├── services/     # HTTP services + auth interceptor
│           ├── shared/       # Reusable UI components
│           └── pages/        # Route components (login, dashboard, etc.)
├── docs/                     # Documentation
└── README.md
```

## Database

SQLite with `better-sqlite3` for development. Tables:
- organizations, users, categories, expenses, budgets, receipts

Foreign keys enabled, WAL mode for performance.
Neon PostgreSQL compatible (date/time functions same).

## Auth Flow

1. Register → creates org + user, returns JWT
2. Login → validates credentials, returns JWT
3. JWT passed as Bearer token in Authorization header
4. JwtAuthGuard protects authenticated routes
