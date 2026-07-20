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

## Challenges & Future Improvements

### Challenges

- JSONPlaceholder returns only `name` and `email`, requiring a transform layer to split names and assign department/role values.
- Mock API responses do not persist, so all CRUD changes are managed in client-side state.

### Future Improvements

- Add unit/integration tests for filter, sort, and CRUD logic
- Replace demo auth with a real authentication service
- Add environment-based API configuration (`.env`)
- Implement optimistic UI updates with rollback on failure
- Add deployment pipeline and hosted demo link

## Deployment (Vercel)

This project deploys **frontend + API together** on Vercel.

### 1. Set environment variable on Vercel

In your Vercel project → **Settings → Environment Variables**, add:

| Name | Value |
|------|-------|
| `MONGO_URI` | `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/user_management?appName=task` |

Also allow MongoDB Atlas network access:
- Go to MongoDB Atlas → Network Access → Add IP Address → **Allow Access from Anywhere** (`0.0.0.0/0`)

### 2. Deploy

```bash
npm run build
# Push to GitHub and connect repo on Vercel, or:
npx vercel --prod
```

### 3. Verify API after deploy

Open these URLs to verify endpoints:

- `https://task-iota-eosin-83.vercel.app/api/health` → should respond with database connection/fallback status
- `https://task-iota-eosin-83.vercel.app/api/users` → should return JSON user list

If `/api/users` returns HTML instead of JSON, redeploy after pulling the latest `vercel.json` fix.

### Why data was missing before

1. `vercel.json` was sending **all routes including `/api`** to `index.html`
2. The Express/MongoDB backend only ran locally, not on Vercel
3. The frontend called `/api/users` on Vercel but got an HTML page back → no data

**Fix applied:** Added `api/index.js` serverless handler + corrected Vercel rewrites so `/api/*` hits the backend.

**Live Demo:**
- **Frontend Dashboard**: [task-iota-eosin-83.vercel.app](https://task-iota-eosin-83.vercel.app/)
- **Backend API Server**: [task-y49o-flax.vercel.app](https://task-y49o-flax.vercel.app/)
