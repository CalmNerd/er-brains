# Backend — Express REST API

Node.js + Express API for authentication, team workspaces, task CRUD, and Groq-powered AI suggestions. Data is stored in PostgreSQL via Prisma.

**Repository:** [github.com/CalmNerd/er-brains](https://github.com/CalmNerd/er-brains)

## Tech Stack

| Technology | Role | Why |
|------------|------|-----|
| **Node.js + TypeScript** | Runtime and language | Shared types with the frontend; ESM modules throughout |
| **Express 5** | HTTP framework | Minimal, well-understood routing and middleware |
| **Prisma** | ORM | Type-safe queries, schema-as-code, fast prototyping with `db push` |
| **PostgreSQL (Neon)** | Database | Relational model for users, teams, and tasks; serverless-friendly hosting |
| **JWT + bcrypt** | Auth | Stateless tokens; passwords hashed before storage |
| **Zod** | Validation | Request body and LLM output validation with clear error messages |
| **Groq SDK** | AI provider | Fast inference via `llama-3.3-70b-versatile`; API key never exposed to clients |
| **tsx** | Dev runner | TypeScript execution with watch mode during development |

## Architecture

The API follows a modular layered structure:

```
routes → controllers → services → Prisma
```

- **Routes** — Wire HTTP methods and paths to controllers; apply `authMiddleware` where needed
- **Controllers** — Parse requests, call services, return standardized responses
- **Services** — Business logic and database access
- **Mappers** — Transform Prisma models to API response shapes (e.g. `Date` → `YYYY-MM-DD` strings)
- **Validation** — Zod schemas per module (`auth`, `teams`, `tasks`, `ai`)
- **Middleware** — Auth (`Bearer` JWT) and centralized error handling

### Modules

| Module | Path prefix | Description |
|--------|-------------|-------------|
| Health | `/api/ping` | Liveness check for deploy wake-up |
| Auth | `/api/auth` | Signup, login, current user |
| Teams | `/api/teams` | CRUD for user-owned teams |
| Tasks | `/api/tasks` | CRUD with optional `?status=` and `?priority=` filters |
| AI | `/api/ai` | Task suggestion generation |

### Database schema

```
User ──┬── Team ── Task
       └── Task (direct ownership)
```

- **User** — `email`, hashed `password`, optional `name`
- **Team** — Belongs to a user; deleting a team cascades to its tasks
- **Task** — `title`, `description`, `dueDate`, `priority`, `status`, linked to both `teamId` and `userId`
- Priority and status are stored as strings aligned with the frontend enum values (no extra mapping layer)

## Setup

### Prerequisites

- Node.js 20+
- Neon PostgreSQL database
- Groq API key

### Environment variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | Secret for signing JWTs |
| `GROQ_API_KEY` | Yes | Groq API key for AI suggestions |
| `PORT` | No | Default `3001` |
| `NODE_ENV` | No | `development` or `production` |
| `CORS_ORIGIN` | No | Frontend origin, default `http://localhost:3000` |
| `JWT_EXPIRES_IN` | No | Token lifetime, default `7d` |

### Install and run

```bash
npm install
npm run db:push      # sync schema to database
npm run dev          # http://localhost:3001
```

### Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with hot reload (`tsx watch`) |
| `npm run build` | Generate Prisma client and compile TypeScript |
| `npm start` | Run compiled `dist/server.js` |
| `npm run typecheck` | Type-check without emitting |
| `npm run db:push` | Push Prisma schema to database |
| `npm run db:migrate` | Create and apply a migration (dev) |
| `npm run db:generate` | Regenerate Prisma client |

## API Reference

All responses use a consistent envelope:

```json
{ "success": true, "message": "...", "data": { ... } }
```

Authenticated routes require:

```
Authorization: Bearer <token>
```

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register `{ email, password, name? }` — creates default `"My Team"` |
| POST | `/api/auth/login` | Login `{ email, password }` |
| GET | `/api/auth/me` | Current user (auth required) |

### Teams

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/teams` | List current user's teams |
| POST | `/api/teams` | Create team `{ name }` |
| PATCH | `/api/teams/:id` | Rename team `{ name }` |
| DELETE | `/api/teams/:id` | Delete team and all tasks (cascade) |

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List tasks (`?status=&priority=`) |
| GET | `/api/tasks/:id` | Get single task |
| POST | `/api/tasks` | Create task |
| PATCH | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

Task response shape:

```json
{
  "id": 1,
  "title": "Fix login bug",
  "description": "Investigate authentication failures",
  "dueDate": "2026-03-15",
  "priority": "High",
  "status": "To Do"
}
```

### AI

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/suggest` | Generate `{ title, description, priority }` from `{ title?, description? }` |

The Groq provider:

- Uses a structured system prompt with priority rubric
- Requests `json_object` response format
- Validates output with Zod; retries once with a stricter prompt on parse failure
- Returns `502` if generation fails after retry

## AI Tools and Resources

- **Groq** — LLM inference (`llama-3.3-70b-versatile`)
- **Cursor** — Used during development for scaffolding modules, validation schemas, and API design

## What I Would Improve With More Time

- **Clean Architecture** — Introduce domain entities, use-case classes, and repository interfaces so services don't depend directly on Prisma; wire adapters in a composition root. Worth it once the domain grows beyond simple CRUD.
- **Prisma migrations** — Replace `db push` with versioned migrations for production
- **Pagination** — Cursor-based pagination on `GET /api/tasks`
- **Server-side sorting** — Support `sortBy` and `ordering` query params
- **Team collaboration** — Multi-user teams with invites and role-based access
- **Rate limiting** — Per-user throttling on auth and AI endpoints
- **Structured logging** — Request IDs, log levels, and error tracking (e.g. Sentry)
- **Integration tests** — Supertest suite against a test database
- **Refresh tokens** — Shorter access tokens with secure refresh flow
- **Task order persistence** — `position` field or join table for manual ordering
