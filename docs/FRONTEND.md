# Hermes Expense Tracker — Frontend Overview

## Pages

| Route | Page | Description |
|-------|------|-------------|
| /login | LoginComponent | Email/password login with demo credentials |
| /register | RegisterComponent | Create organization + user account |
| /dashboard | DashboardComponent | KPI cards, category breakdown, recent expenses |
| /expenses | ExpensesComponent | Filterable expense table with status badges |
| /categories | CategoriesComponent | Category cards with color-coded icons |
| /budgets | BudgetsComponent | Budget vs actual with utilization progress bars |

## State Management

Uses Angular signals (`signal()` + `computed()`) instead of NgRx or services with subjects.
Each service exposes `readonly` signals for loading/error/data states.

## Services

- **AuthService** — login, register, logout, JWT storage, current user signal
- **ExpenseService** — CRUD + dashboard stats
- **CategoryService** — CRUD by organization
- **BudgetService** — CRUD + budget-vs-actual analysis
- **ReceiptService** — receipt metadata management
- **AuthInterceptor** — attaches JWT Bearer token to all HTTP requests

## Shared Components

- **HeaderComponent** — sticky header with title, user avatar, sidebar toggle
- **SidebarComponent** — fixed sidebar with navigation + logout
- **KpiCardComponent** — metric display card with icon, value, trend

## Build

```bash
cd apps/web && ./node_modules/.bin/ng build
```

Output: `apps/web/dist/web/`

## Environment

API URL is hardcoded to `http://localhost:3000/api` in each service.
Update for production deployment.
