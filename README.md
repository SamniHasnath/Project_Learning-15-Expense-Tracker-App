# Wallet.io - Expense Tracker (PERN)

A full-stack expense tracker with JWT authentication, role-based access control (User / Admin), income & expense management, budgets, analytics, and PDF/Excel reports — built with PostgreSQL, Express, React (Vite), and Node.js.

## Features

### Authentication

- Register / Login with JWT
- Roles: `user` and `admin` (RBAC enforced on every protected route)
- Blocked users are locked out immediately, even with a valid token

### User Dashboard

Routes:

- `/dashboard`
- `/income`
- `/expenses`
- `/budget`
- `/reports`

Features:

- Stat cards: total income, total expenses, current balance, monthly budget
- Income & expense CRUD with categories and dates
- Per-category monthly budgets with spent/remaining and "budget exceeded" warnings
- Reports:
  - Category pie chart
  - Income-vs-expense bar chart
  - PDF export
  - Excel export

### Admin Dashboard

Routes:

- `/admin`
- `/admin/users`
- `/admin/transactions`
- `/admin/analytics`

Features:

- System-wide stats:
  - Total users
  - Active users
  - New users this month
  - Total transactions
  - Total income/expenses
- User management:
  - Search
  - Block/unblock
  - Delete
- All transactions across all users with filters:
  - User
  - Category
  - Type
  - Date range
- Analytics:
  - Income vs expense by month
  - Category-wise expenses
  - User growth

## Tech Stack

### Frontend

- React 19
- Vite
- React Router
- Chart.js
- Axios
- jsPDF
- SheetJS (xlsx)

### Backend

- Node.js
- Express 5
- JWT
- bcryptjs

### Database

- PostgreSQL

## Project Structure

```text
expense-tracker/
├── server/
│   ├── db.js                 # Postgres pool (reads from .env)
│   ├── db/
│   │   ├── schema.sql        # Table definitions
│   │   ├── migrate.js        # Creates/recreates the schema
│   │   └── seed.js           # Creates the initial admin account
│   ├── middleware/auth.js    # JWT auth + RBAC middleware
│   ├── controllers/          # Route handlers
│   ├── routes/               # Express routers
│   └── server.js
└── client/
    └── src/
        ├── api/axios.js      # API client with auth interceptor
        ├── context/AuthContext.jsx
        ├── components/       # Shared UI (forms, lists, charts, layout)
        ├── pages/user/       # Dashboard, Income, Expenses, Budget, Reports
        └── pages/admin/      # Overview, Users, Transactions, Analytics
