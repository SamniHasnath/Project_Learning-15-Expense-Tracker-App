# Wallet.io — Expense Tracker (PERN)

A full-stack expense tracker with JWT authentication, role-based access control
(User / Admin), income & expense management, budgets, analytics, and PDF/Excel
reports — built with PostgreSQL, Express, React (Vite) and Node.

## Features

**Authentication**
- Register / Login with JWT
- Roles: `user` and `admin` (RBAC enforced on every protected route)
- Blocked users are locked out immediately, even with a valid token

**User Dashboard** (`/dashboard`, `/income`, `/expenses`, `/budget`, `/reports`)
- Stat cards: total income, total expenses, current balance, monthly budget
- Income & expense CRUD with categories and dates
- Per-category monthly budgets with spent/remaining and "budget exceeded" warnings
- Reports: category pie chart, income-vs-expense bar chart, PDF & Excel export

**Admin Dashboard** (`/admin`, `/admin/users`, `/admin/transactions`, `/admin/analytics`)
- System-wide stats: total users, active users, new users this month, total transactions, total income/expenses
- User management: search, block/unblock, delete
- All transactions across all users with filters (user, category, type, date range)
- Analytics: income vs expense by month, category-wise expenses, user growth
  
 <img width="883" height="508" alt="image" src="https://github.com/user-attachments/assets/4acf383e-4e9b-4551-aa4e-76779cd29d14" />
 

## Tech Stack

- **Frontend**: React 19, Vite, React Router, Chart.js, Axios, jsPDF, SheetJS (xlsx)
- **Backend**: Node.js, Express 5, JWT, bcryptjs
- **Database**: PostgreSQL

## Project Structure

```
expense-tracker/
├── server/
│   ├── db.js                 # Postgres pool (reads from .env)
│   ├── db/
│   │   ├── schema.sql        # Table definitions
│   │   ├── migrate.js         # Creates/recreates the schema
│   │   └── seed.js            # Creates the initial admin account
│   ├── middleware/auth.js     # JWT auth + RBAC middleware
│   ├── controllers/           # Route handlers
│   ├── routes/                # Express routers
│   └── server.js
└── client/
    └── src/
        ├── api/axios.js       # API client with auth interceptor
        ├── context/AuthContext.jsx
        ├── components/        # Shared UI (forms, lists, charts, layout)
        ├── pages/user/         # Dashboard, Income, Expenses, Budget, Reports
        └── pages/admin/        # Overview, Users, Transactions, Analytics
```

## API Reference

Base URL: `/api`. All endpoints except `/auth/register` and `/auth/login`
require an `Authorization: Bearer <token>` header.

#### Auth — `/api/auth`

| Method | Endpoint    | Auth  | Description                          |
| ------ | ----------- | ----- | ------------------------------------ |
| POST   | `/register` | —     | Create a new account (role `user`)   |
| POST   | `/login`    | —     | Log in, returns `{ token, user }`    |
| GET    | `/me`       | User  | Get the current authenticated user   |

#### Transactions — `/api/transactions`

| Method | Endpoint   | Description                                                              |
| ------ | ---------- | ------------------------------------------------------------------------ |
| GET    | `/`        | List the current user's transactions (filters: `type`, `category`, `startDate`, `endDate`) |
| GET    | `/summary` | Totals, last-6-months income/expense series, and category breakdown      |
| POST   | `/`        | Create a transaction (`type`, `title`, `category`, `amount`, `date`)     |
| PUT    | `/:id`     | Update a transaction                                                      |
| DELETE | `/:id`     | Delete a transaction                                                      |

#### Budgets — `/api/budgets`

| Method | Endpoint | Description                                                              |
| ------ | -------- | ------------------------------------------------------------------------ |
| GET    | `/`      | Get budgets for a month/year (defaults to current), with spent/remaining/exceeded |
| POST   | `/`      | Create or update a budget (`category`, `amount`, `month`, `year`)        |
| DELETE | `/:id`   | Delete a budget                                                           |

#### Admin — `/api/admin` (requires `role: admin`)

| Method | Endpoint              | Description                                                       |
| ------ | --------------------- | ------------------------------------------------------------------ |
| GET    | `/overview`           | System-wide stats: users, active users, new users this month, transactions, totals |
| GET    | `/users`              | List/search users (`search` query param)                          |
| PATCH  | `/users/:id/status`   | Set a user's status to `active` or `blocked`                       |
| DELETE | `/users/:id`          | Delete a user                                                       |
| GET    | `/transactions`       | All transactions across users (filters: `userId`, `category`, `type`, `startDate`, `endDate`) |
| GET    | `/analytics`          | Income vs expense by month, category breakdown, user growth        |

## Local Setup

### 1. Database

Create a Postgres database matching `server/.env` (defaults to `expense_tracker`),
then run:

```bash
cd server
npm install
npm run migrate   # creates users / transactions / budgets tables
npm run seed      # creates the admin account from .env
```

### 2. Backend

```bash
cd server
npm run dev       # http://localhost:5000
```

Configure `server/.env`:

| Variable | Description |
|---|---|
| `DB_*` | Postgres connection details |
| `JWT_SECRET` | Secret used to sign auth tokens (set a long random value) |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `CLIENT_URL` | Frontend origin, used for CORS |
| `ADMIN_NAME` / `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Used once by `npm run seed` to create the admin account |

### 3. Frontend

```bash
cd client
npm install
npm run dev       # http://localhost:5173
```

Optionally set `VITE_API_URL` (e.g. in `client/.env`) if the API isn't at
`http://localhost:5000/api`.

### 4. Sign in

- Register a new account at `/register` → lands on the **User** dashboard.
- Sign in with the seeded admin account (`ADMIN_EMAIL` / `ADMIN_PASSWORD` from
  `server/.env`, defaults to `admin@example.com` / `Admin@123`) → lands on the
  **Admin** dashboard.

## Deployment

This app is fully configured via environment variables, so it can be deployed
to any Node host + managed Postgres. The steps below use a free-tier stack —
**Neon** (Postgres) + **Render** (API) + **Vercel** (frontend) — but the same
steps apply to Supabase/Railway/Netlify etc.

### Step 1 — Database (Neon)

1. Create a free account/project at [neon.tech](https://neon.tech) (or [Supabase](https://supabase.com)).
2. Copy the connection details: host, database name, user, password, port.
3. Temporarily set these `DB_*` values in a local `server/.env`.
4. From `server/`, run once against the new database:
   ```bash
   npm run migrate   # creates users / transactions / budgets tables
   npm run seed      # creates the admin account from ADMIN_* in .env
   ```
5. Keep these `DB_*` values — they're added as env vars on Render in Step 2.

### Step 2 — Backend API (Render)

1. Push this repository to GitHub.
2. On [render.com](https://render.com): **New → Web Service** → connect the repo.
3. Configure the service:
   - **Root directory**: `expense-tracker/server`
   - **Build command**: `npm install`
   - **Start command**: `npm start`
4. Add environment variables (Render → Environment tab):
   - `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_NAME` (from Step 1)
   - `JWT_SECRET` — a new long random string (don't reuse the dev value)
   - `JWT_EXPIRES_IN` — e.g. `7d`
   - `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` — only needed if you re-run `npm run seed`
   - `CLIENT_URL` — placeholder for now (e.g. `http://localhost:5173`), updated in Step 4
5. Deploy and note the service URL, e.g. `https://expense-tracker-api.onrender.com`.
6. Sanity check: open `https://expense-tracker-api.onrender.com/test-db` — should
   return `{ "message": "Database Connected!", ... }`.

### Step 3 — Frontend (Vercel)

1. On [vercel.com](https://vercel.com): **Add New → Project** → import the same repo.
2. Configure the project:
   - **Root directory**: `expense-tracker/client`
   - **Build command**: `npm run build`
   - **Output directory**: `dist`
3. Add environment variable:
   - `VITE_API_URL` = `https://expense-tracker-api.onrender.com/api` (from Step 2)
4. Deploy and note the resulting URL, e.g. `https://wallet-io.vercel.app`.

### Step 4 — Connect frontend and backend

1. Back on Render, update the backend's `CLIENT_URL` env var to the Vercel URL
   from Step 3 (e.g. `https://wallet-io.vercel.app`).
2. Redeploy/restart the backend so CORS allows the deployed frontend.

### Step 5 — Verify

1. Open the Vercel URL → `/register` → create a test user → should land on the **User** dashboard.
2. Log out, log in with the seeded admin (`ADMIN_EMAIL` / `ADMIN_PASSWORD`) → should land on the **Admin** dashboard.
3. Add a transaction/budget as the test user, then confirm it appears under Admin → Transactions / Analytics.

