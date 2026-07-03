# Task Manager

A full-stack task management application with team workspaces, list and board views, drag-and-drop ordering, and Groq-powered AI task suggestions.

**Live demo:** [er-brains.vercel.app](https://er-brains.vercel.app/)

**Repository:** [github.com/CalmNerd/er-brains](https://github.com/CalmNerd/er-brains)

## Features

- **Authentication** — Email/password signup and login with JWT sessions
- **Team workspaces** — Create, rename, and delete teams; each user gets a default `"My Team"` on signup
- **Task CRUD** — Create, edit, and delete tasks with title, description, due date, priority, and status
- **List and board layouts** — Switch between a grouped list view and a Kanban-style board
- **Filtering and sorting** — View all or active tasks; sort by status, priority, or due date (asc/desc)
- **Drag and drop** — Reorder tasks within a status column or move them across columns (when sorted by status)
- **AI suggestions** — Debounced Groq suggestions for title, description, and priority with per-field accept/reject
- **Optimistic updates** — Task mutations feel instant via TanStack Query
- **Landing page** — Marketing-style hero with an interactive dashboard preview

## How to Run Locally

### Prerequisites

- **Node.js 20+**
- A [Neon](https://neon.tech) PostgreSQL database (free tier works)
- A [Groq](https://console.groq.com) API key (for AI suggestions)

### 1. Clone and install

```bash
git clone https://github.com/CalmNerd/er-brains.git
cd er-brains
```

### 2. Backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `JWT_SECRET` | Long random secret for signing tokens |
| `GROQ_API_KEY` | Groq API key for AI suggestions |
| `CORS_ORIGIN` | `http://localhost:3000` for local dev |

```bash
npm install
npm run db:push    # sync Prisma schema to your database
npm run dev        # starts API at http://localhost:3001
```

### 3. Frontend

In a second terminal:

```bash
cd frontend
cp .env.example .env   # optional — defaults to http://localhost:3001
npm install
npm run dev            # starts app at http://localhost:3000
```

### 4. Use the app

1. Open [http://localhost:3000](http://localhost:3000)
2. Sign up for an account
3. Create tasks, switch layouts, and try AI suggestions in the task modal

## Tech Stack

| Layer | Technology | Why |
|-------|------------|-----|
| Frontend | Next.js 16, React 19, TypeScript | App Router, strong typing, fast local dev |
| UI | Tailwind CSS 4, shadcn/ui | Consistent design system with accessible primitives |
| State / data | TanStack Query, Zustand | Server cache + optimistic updates; lightweight UI state |
| Drag and drop | @dnd-kit | Flexible list and board DnD without heavy dependencies |
| Backend | Node.js, Express 5, TypeScript | Simple REST API with a familiar modular structure |
| Database | PostgreSQL (Neon) + Prisma | Relational data with type-safe queries and easy schema sync |
| Auth | JWT + bcrypt | Stateless API auth without extra infrastructure |
| Validation | Zod (shared patterns) | Runtime validation on both client and server |
| AI | Groq (Llama 3.3 70B) | Fast, free-tier-friendly inference; key stays server-side |

See [frontend/README.md](./frontend/README.md) and [backend/README.md](./backend/README.md) for layer-specific details.

## AI Tools, Libraries, and Resources

### AI in the product

- **Groq** — `llama-3.3-70b-versatile` generates task title, description, and priority from rough user input
- Suggestions are **stateless**: the LLM output is validated with Zod on the backend; tasks are only saved when the user explicitly submits the form

### Development tools

- **Cursor** — AI-assisted coding, refactoring, and documentation during development
- **shadcn/ui** — Component scaffolding via CLI
- **Hugeicons** — Icon set used across the UI

### Key libraries

| Area | Libraries |
|------|-----------|
| Frontend | `@tanstack/react-query`, `@dnd-kit/*`, `axios`, `zod`, `zustand`, `motion`, `sonner` |
| Backend | `express`, `@prisma/client`, `groq-sdk`, `jsonwebtoken`, `bcrypt`, `zod` |

## Codebase Architecture

Two separate apps in one repo — **frontend** (Next.js) and **backend** (Express) — each with its own dependencies and deploy target. They talk over a REST API with JWT auth.

**Backend** — Feature modules (`auth`, `teams`, `tasks`, `ai`) follow `routes → controllers → services → Prisma`. Zod validates inputs; mappers shape API responses. Shared auth, errors, and config live in `middleware/` and `utils/`.

**Frontend** — `components/` handle UI only. Business logic sits in `lib/` (API client, task utils, schemas) and `hooks/` (queries, DnD, AI). TanStack Query manages server state with optimistic updates; Zustand holds UI preferences (view, sort, modals).

More detail in [frontend/README.md](./frontend/README.md) and [backend/README.md](./backend/README.md).

## Project Structure

```
├── frontend/     # Next.js app — see frontend/README.md
├── backend/      # Express REST API — see backend/README.md
└── README.md
```

## Deployment

**Live app:** [https://er-brains.vercel.app](https://er-brains.vercel.app/)

Stack in production:

- **Frontend** — Vercel (`frontend/` directory)
- **Backend** — Render (free tier; may sleep — use the wake control on the landing page)
- **Database** — Neon PostgreSQL

Backend environment variables for production:

- `DATABASE_URL`
- `JWT_SECRET`
- `GROQ_API_KEY`
- `CORS_ORIGIN` (your frontend URL)
- `NODE_ENV=production`

On deploy, run `prisma db push` or `prisma migrate deploy` against your production database.

## What I Would Improve With More Time

- **Clean Architecture at scale** — For a larger codebase, I'd adopt stricter Clean Architecture. The current modular structure is a pragmatic fit for this scope; Clean Architecture would pay off as teams, permissions, and integrations grow.
- **Git workflow** — Use feature branches and pull requests instead of committing directly to `main`, with clearer commit history and review before merge.
- **Stronger authentication** — Refresh tokens with short-lived access tokens, password strength validation, secure logout with token revocation, and session management (e.g. remember-me, force sign-out everywhere).
- **Persist manual task order** — Drag-and-drop order is client-side only; store `position` or an order array in the database
- **Real-time collaboration** — WebSockets or SSE so multiple users see task changes live
- **Team members and roles** — Invite users, assign tasks, and enforce permissions beyond single-owner teams
- **Server-side filtering** — Move sort/filter logic to the API with pagination for large task lists
- **Automated tests** — Unit tests for services/utils and integration tests for API routes
- **Migrations over `db push`** — Proper Prisma migration history for production rollouts
- **Rate limiting and AI cost controls** — Throttle `/api/ai/suggest` per user to prevent abuse
- **Offline / error recovery** — Retry queues and clearer conflict handling for failed optimistic updates
- **Accessibility audit** — Full keyboard navigation for board DnD and screen-reader labels on drag overlays
- **SEO & Domain** — Richer metadata (Open Graph, Twitter cards), structured data, and per-route titles/descriptions for better discoverability and link previews and A dedicated domain for better brandings.