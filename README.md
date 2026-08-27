# Wallet.io — Expense Tracker (PERN)

A full-stack expense tracker with JWT authentication, role-based access control (User / Admin), income & expense management, budgets, analytics, and PDF/Excel reports — built with **P**ostgreSQL, **E**xpress, **R**eact (Vite), and **N**ode.js.

<img width="883" height="508" alt="Wallet.io dashboard screenshot" src="https://github.com/user-attachments/assets/4acf383e-4e9b-4551-aa4e-76779cd29d14" />
<img width="1506" height="562" alt="image" src="https://github.com/user-attachments/assets/66aa1e53-0d05-4f13-b464-439b8a749755" />
<img width="1517" height="545" alt="image" src="https://github.com/user-attachments/assets/552e7db5-89e0-4676-9e7b-e168faae25b8" />
<img width="1530" height="518" alt="image" src="https://github.com/user-attachments/assets/0c2b5cb5-52a3-400b-b1c7-e1e4c26a4af3" />
<img width="1517" height="595" alt="image" src="https://github.com/user-attachments/assets/a7e26b30-d610-416b-b3c8-970c0f620f7c" />
<img width="1532" height="578" alt="image" src="https://github.com/user-attachments/assets/b5b18bdd-9215-46e1-b29e-5bd9ed1c8e0e" />
<img width="1517" height="595" alt="image" src="https://github.com/user-attachments/assets/e9fc051a-c236-457e-a971-ac605b8d37ba" />


## Features

### Authentication

- Register / Login with JWT
- Roles: `user` and `admin` (RBAC enforced on every protected route)
- Blocked users are locked out immediately, even with a valid token

### User Dashboard

Routes: `/dashboard` · `/income` · `/expenses` · `/budget` · `/reports`

- Stat cards: total income, total expenses, current balance, monthly budget
- Income & expense CRUD with categories and dates
- Per-category monthly budgets with spent/remaining and "budget exceeded" warnings
- Reports: category pie chart, income-vs-expense bar chart, PDF export, Excel export

### Admin Dashboard

Routes: `/admin` · `/admin/users` · `/admin/transactions` · `/admin/analytics`

- System-wide stats: total users, active users, new users this month, total transactions, total income/expenses
- User management: search, block/unblock, delete
- All transactions across all users with filters (user, category, type, date range)
- Analytics: income vs expense by month, category-wise expenses, user growth

## Tech Stack

| Layer    | Tech                                                                 |
| -------- | --------------------------------------------------------------------- |
| Frontend | React 19, Vite, React Router, Chart.js, Axios, jsPDF, SheetJS (xlsx)   |
| Backend  | Node.js, Express 5, JWT, bcryptjs                                     |
| Database | PostgreSQL                                                             |

## Project Structure

```text
expense-tracker/
├── server/
│   ├── db.js                 # Postgres pool (reads DB_URL from .env)
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
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- A PostgreSQL database — either [local PostgreSQL](https://www.postgresql.org/download/) or a hosted instance (e.g. [Neon](https://neon.tech/))

### 1. Clone & install

```bash
git clone <repo-url>
cd expense-tracker

cd server && npm install
cd ../client && npm install
```

### 2. Configure environment variables

**`server/.env`** (copy from `server/.env.example`):

| Variable         | Description                                                        |
| ---------------- | -------------------------------------------------------------------- |
| `PORT`           | Backend port (default `5000`)                                        |
| `DB_URL`         | Postgres connection string, e.g. `postgresql://user:pass@localhost:5432/expense_tracker` |
| `JWT_SECRET`     | Long random string used to sign JWTs                                  |
| `JWT_EXPIRES_IN` | Token lifetime (default `7d`)                                        |
| `CLIENT_URL`     | Frontend origin, used for CORS (e.g. `http://localhost:5173`)         |
| `ADMIN_NAME`     | Name for the seeded admin account                                     |
| `ADMIN_EMAIL`    | Email for the seeded admin account                                    |
| `ADMIN_PASSWORD` | Password for the seeded admin account                                 |

> SSL is applied automatically for non-local `DB_URL` hosts (e.g. Neon) and skipped for `localhost`/`127.0.0.1`.

**`client/.env`**:

| Variable       | Description                              |
| -------------- | ------------------------------------------ |
| `VITE_API_URL` | Base URL of the backend API, e.g. `http://localhost:5000/api` |

### 3. Set up the database

```bash
cd server
npm run migrate   # creates tables from db/schema.sql
npm run seed       # creates the initial admin account
```

### 4. Run the app

In two terminals:

```bash
# Terminal 1 — backend (http://localhost:5000)
cd server
npm run dev

# Terminal 2 — frontend (http://localhost:5173)
cd client
npm run dev
```

Open the frontend URL in your browser. Log in with the admin credentials from `server/.env`, or register a new user account.

## Scripts

| Location  | Command         | Description                          |
| --------- | --------------- | --------------------------------------- |
| `server/` | `npm run dev`    | Start backend with auto-reload (nodemon) |
| `server/` | `npm start`      | Start backend in production mode         |
| `server/` | `npm run migrate`| Create/recreate the database schema     |
| `server/` | `npm run seed`   | Seed the initial admin account           |
| `client/` | `npm run dev`    | Start Vite dev server                    |
| `client/` | `npm run build`  | Production build                         |
| `client/` | `npm run lint`   | Run ESLint                               |
| `client/` | `npm run preview`| Preview the production build locally     |

## API Overview

All routes are prefixed with `/api`. Protected routes require `Authorization: Bearer <token>`.

| Method | Endpoint                        | Access        | Description                  |
| ------ | -------------------------------- | ------------- | ------------------------------- |
| POST   | `/auth/register`                 | Public        | Create a new user account       |
| POST   | `/auth/login`                    | Public        | Log in and receive a JWT        |
| GET    | `/auth/me`                       | Authenticated | Get the current user            |
| GET    | `/transactions`                  | Authenticated | List the user's transactions    |
| GET    | `/transactions/summary`          | Authenticated | Income/expense/balance summary  |
| POST   | `/transactions`                  | Authenticated | Create a transaction            |
| PUT    | `/transactions/:id`               | Authenticated | Update a transaction            |
| DELETE | `/transactions/:id`               | Authenticated | Delete a transaction            |
| GET    | `/budgets`                       | Authenticated | List category budgets           |
| POST   | `/budgets`                       | Authenticated | Create/update a category budget |
| DELETE | `/budgets/:id`                    | Authenticated | Delete a budget                 |
| GET    | `/admin/overview`                 | Admin         | System-wide stats               |
| GET    | `/admin/users`                    | Admin         | List all users                  |
| PATCH  | `/admin/users/:id/status`          | Admin         | Block/unblock a user            |
| DELETE | `/admin/users/:id`                 | Admin         | Delete a user                   |
| GET    | `/admin/transactions`              | Admin         | List all transactions           |
| GET    | `/admin/analytics`                 | Admin         | System-wide analytics           |

## Troubleshooting

- **Registration/login hangs or times out** — usually the database is unreachable. If using a hosted/serverless Postgres (e.g. Neon), the compute may need to "wake up"; check the provider's dashboard. `server/db.js` applies a 10s connection timeout so failures surface with a clear error instead of hanging.
- **CORS errors in the browser console** — make sure `CLIENT_URL` in `server/.env` exactly matches the URL the frontend is running on, then restart the backend (it doesn't hot-reload `.env` changes).
- **`EACCES: permission denied` on `vite`'s dev server port** — the port may fall in a Windows-reserved range. Check with `netsh interface ipv4 show excludedportrange protocol=tcp` and pick a port outside any listed range in `client/vite.config.js`.
