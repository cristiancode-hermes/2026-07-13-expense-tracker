# Hermes Expense Tracker — API Reference

Base URL: `http://localhost:3000/api`
Swagger UI: `http://localhost:3000/api/docs`

## Authentication

### POST /api/auth/login
```json
{ "email": "admin@acme.com", "password": "password123" }
→ { "accessToken": "...", "user": { "id", "name", "email", "organizationId" } }
```

### POST /api/auth/register
```json
{ "name": "John", "email": "john@acme.com", "password": "pass", "organizationId": "..." }
→ { "accessToken": "...", "user": { ... } }
```

## Organizations

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/organizations | No | List active orgs |
| GET | /api/organizations/:id | No | Get org by ID |
| POST | /api/organizations | No | Create org |
| PATCH | /api/organizations/:id | No | Update org |
| DELETE | /api/organizations/:id | No | Soft-delete org |

## Users

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/users | No | Create user |
| GET | /api/users/:id | JWT | Get user by ID |
| GET | /api/users/organization/:orgId | JWT | List org users |
| PATCH | /api/users/:id | JWT | Update user |
| DELETE | /api/users/:id | JWT | Delete user |

## Expenses

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/expenses/organization/:orgId | JWT | List expenses (filters: categoryId, status, startDate, endDate) |
| GET | /api/expenses/dashboard/:orgId | JWT | Dashboard stats (total, byCategory, monthlyTotal) |
| GET | /api/expenses/:id | JWT | Get expense |
| POST | /api/expenses | JWT | Create expense |
| PATCH | /api/expenses/:id | JWT | Update expense |
| DELETE | /api/expenses/:id | JWT | Delete expense |

### POST /api/expenses
```json
{
  "organizationId": "org-acme",
  "userId": "user-jane",
  "categoryId": "cat-meals",
  "amount": 45.50,
  "description": "Team lunch",
  "date": "2026-07-01",
  "isReimbursable": false
}
```

## Categories

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/categories/organization/:orgId | JWT | List categories |
| GET | /api/categories/:id | JWT | Get category |
| POST | /api/categories | JWT | Create category |
| PATCH | /api/categories/:id | JWT | Update category |
| DELETE | /api/categories/:id | JWT | Deactivate category |

## Budgets

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/budgets/organization/:orgId | JWT | List budgets |
| GET | /api/budgets/analysis/:orgId | JWT | Budget vs actual spending |
| GET | /api/budgets/:id | JWT | Get budget |
| POST | /api/budgets | JWT | Create budget |
| PATCH | /api/budgets/:id | JWT | Update budget |
| DELETE | /api/budgets/:id | JWT | Deactivate budget |

## Receipts

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/receipts/expense/:expenseId | JWT | List receipts for expense |
| GET | /api/receipts/:id | JWT | Get receipt |
| POST | /api/receipts | JWT | Upload receipt metadata |
| DELETE | /api/receipts/:id | JWT | Delete receipt |
