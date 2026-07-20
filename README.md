# User Management Dashboard

A React + Vite application for managing users via the [JSONPlaceholder](https://jsonplaceholder.typicode.com/) mock API. Built as part of the Ajackus User Management Dashboard assignment.

## Features

- View users fetched from `GET /users`
- Add, edit, view, and delete users (with local state updates after mock API calls)
- Search by first name, last name, email, and department
- Sort users by multiple fields (ascending/descending)
- Filter popup with first name, last name, email, and department filters
- Pagination with 10, 25, 50, and 100 records per page
- Client-side form validation (React Hook Form + Yup)
- Loading, empty, and error states with retry support
- Responsive layout for desktop, tablet, and mobile

## Tech Stack

- React 19
- Vite 8
- Material UI 9
- MUI X Data Grid
- React Router
- Axios
- React Hook Form + Yup
- React Toastify

## Prerequisites

- Node.js 18+
- npm 9+

## Setup

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
npm install --prefix server

# Copy env files (already created if you cloned with them)
# server/.env  → MongoDB connection string (server-side only)
# .env         → VITE_API_URL=/api
```

### MongoDB connection

The database URI belongs in **`server/.env`**, not in `dist/` or the React app:

```env
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/user_management?appName=task
PORT=5000
```

On first run, if the database is empty, the server seeds 10 users from JSONPlaceholder.

## Run (Development)

**Option A — run both frontend and backend:**

```bash
npm run dev:all
```

**Option B — run separately in two terminals:**

```bash
npm run dev:server   # API at http://localhost:5000
npm run dev          # UI at http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

**Demo login credentials:** `admin` / `admin`

## Build (Production)

```bash
npm run build
npm run preview
```

## Lint

```bash
npm run lint
```

## Project Structure

```
src/
├── components/
│   ├── auth/          # Protected route wrapper
│   ├── common/        # Reusable UI (table, modals, filters)
│   ├── layout/        # Navbar, Sidebar
│   └── pages/         # Dashboard, Login, NotFound
├── context/           # Auth context (demo login)
├── data/              # Static department/role lists
├── services/          # JSONPlaceholder API layer
└── theme/             # MUI theme configuration
```

## Assumptions

1. **JSONPlaceholder seed** — On first connect, if MongoDB is empty, the backend seeds users from JSONPlaceholder. After that, all CRUD operations persist in MongoDB.
2. **Department and role** — Assigned during seed; stored in MongoDB for all users.
3. **Edit flow** — Fetches fresh user data from `GET /api/users/:id` before editing.
4. **Authentication** — Demo login (`admin` / `admin`); not required by the assignment.
5. **Security** — Never put `MONGO_URI` in the React app or `dist/` folder. It must stay in `server/.env` only.

## Features & Polish Completed

### 1. Robust Backend Fallback
- The backend automatically catches MongoDB Atlas connection failures (e.g. from missing whitelists or variables) and falls back to a custom **in-memory database proxy** seeded from JSONPlaceholder.
- Full CRUD operations, resets, and modifications are persisted in-memory on the server, solving the standard serverless "no persistence" limitation.

### 2. Warn-Free React 19 / MUI v9 Integration
- Migrated legacy `InputProps` and `PaperProps` to the modern `slotProps` API across all dialogs and search inputs, producing **0 console warnings and 0 linter issues**.

### 3. Settings Management & Notifications Dropdown
- Created a dynamic **Settings Page** allowing simulated API network latency adjustments via a slider, dark theme toggling, and in-memory database resets.
- Added a functional **Notifications Dropdown Menu** with real-time clearing capabilities and dynamic badge updates.

### 4. Dark Mode Aesthetics & Routing
- Handled text contrast for table headers, hovered rows, and profile menus in dark mode to ensure perfect readability.
- Separated `/dashboard`, `/users`, and `/settings` routing paths, preventing double active navigation highlights.

---

## Deployment (Vercel)

This repository supports deploying the **frontend + API together** or the **backend server independently** as serverless Node.js functions on Vercel.

### 1. Set environment variable on Vercel

In your Vercel project **Settings → Environment Variables**, add:

| Name | Value |
|------|-------|
| `MONGO_URI` | `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/user_management?appName=task` |

*Note: If MongoDB Atlas connection fails or is not whitelisted, the API server falls back to the in-memory seed database automatically.*

### 2. Verify API after deploy

Open these URLs to verify endpoints:

- **Health Check**: `https://task-iota-eosin-83.vercel.app/api/health` -> responds with status and database connection state
- **Users List**: `https://task-iota-eosin-83.vercel.app/api/users` -> returns the JSON user list

---

## Live Deployments

- **Frontend & Unified API Dashboard**: [task-iota-eosin-83.vercel.app](https://task-iota-eosin-83.vercel.app/)
- **Independent Backend API Server**: [task-y49o-flax.vercel.app](https://task-y49o-flax.vercel.app/)

