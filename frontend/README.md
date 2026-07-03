# Frontend — Next.js Task Manager

Next.js 16 app with list and board task views, team navigation, drag-and-drop, and AI-assisted task creation.

**Repository:** [github.com/CalmNerd/er-brains](https://github.com/CalmNerd/er-brains)

## Tech Stack

| Technology | Role | Why |
|------------|------|-----|
| **Next.js 16 (App Router)** | Framework | File-based routing, RSC where useful, fast dev experience |
| **React 19** | UI library | Latest concurrent features and ecosystem support |
| **TypeScript** | Language | End-to-end type safety with shared Zod schemas |
| **Tailwind CSS 4** | Styling | Utility-first CSS with design tokens |
| **shadcn/ui** | Components | Accessible, customizable primitives (Dialog, Sidebar, Select, etc.) |
| **TanStack Query** | Server state | Caching, mutations, and optimistic updates for tasks and teams |
| **Zustand** | Client UI state | View mode, sort/filter preferences, and modal state without prop drilling |
| **@dnd-kit** | Drag and drop | List and board reordering with keyboard and pointer sensors |
| **Axios** | HTTP client | Interceptors for auth headers and consistent API calls |
| **Zod** | Validation | Task and auth form schemas aligned with backend |
| **Motion** | Animation | Landing page and UI transitions |
| **Sonner** | Toasts | Mutation success/error feedback |
| **Hugeicons** | Icons | Consistent icon set across the app |

## Features

### Pages and routing

| Route | Description |
|-------|-------------|
| `/` | Landing page with hero and dashboard preview; redirects to `/dashboard` if logged in |
| `/login` | Email/password login |
| `/signup` | Registration with optional name |
| `/dashboard` | Main task management UI (auth-guarded) |

### Task management

- **List view** — Tasks grouped by status (`To Do`, `In Progress`, `Done`) in collapsible sections
- **Board view** — Kanban columns with cards
- **Toolbar** — Toggle all/active tasks; open filter menu for layout, sort, and order
- **Sorting** — By status, priority, or due date (ascending/descending)
- **Drag and drop** — Reorder within a column or move across columns when sorted by status; manual order stored in client state per team
- **Inline updates** — Change status and priority from row/card dropdowns
- **Task modal** — Create and edit with metadata fields, delete, and "create more" toggle

### AI suggestions

- Debounced calls to `POST /api/ai/suggest` while typing title or description
- Per-field accept/reject UI for title, description, and priority
- Aborts in-flight requests on modal close or new input
- Suggestions are preview-only until the user saves the task

### Teams

- Sidebar team list with create, rename, and delete
- Team selection drives which tasks are loaded and displayed
- UI resets task filters when switching teams

### Auth

- JWT stored in `localStorage`; attached via Axios interceptor
- `AuthGuard` protects dashboard routes
- Logout clears query cache and redirects to login

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages and layout
├── components/
│   ├── auth/               # Login, signup, auth guard
│   ├── landing/            # Marketing landing page
│   ├── task-board/         # Kanban board view
│   ├── task-list/          # List view, toolbar, filters, rows
│   ├── task-modal/         # Create/edit modal + AI hook
│   └── ui/                 # shadcn/ui primitives
├── hooks/
│   ├── queries/            # TanStack Query hooks (tasks, teams, user)
│   ├── use-task-dnd.ts     # Drag-and-drop logic
│   └── use-manual-task-order.ts
├── lib/
│   ├── api/                # Axios client, endpoints, types
│   ├── auth/               # Token storage, schemas
│   ├── tasks/              # Types, utils, constants, API helpers
│   ├── ai/                 # AI suggest API and payload builder
│   └── query/              # Query client, keys, optimistic helpers
└── stores/                 # Zustand stores (auth, task UI, team UI)
```

Business logic lives in `lib/` and `hooks/`; components focus on rendering and user interaction.

## Setup

### Prerequisites

- Node.js 20+
- Backend running at `http://localhost:3001` (see [backend/README.md](../backend/README.md))

### Environment variables

```bash
cp .env.example .env
```

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | No | API base URL; defaults to `http://localhost:3001` |

### Install and run

```bash
npm install
npm run dev      # http://localhost:3000
```

### Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run format` | Prettier (TS/TSX) |
| `npm run typecheck` | `tsc --noEmit` |

## Adding shadcn/ui Components

```bash
npx shadcn@latest add button
```

Components are placed in `components/ui/` and imported as:

```tsx
import { Button } from "@/components/ui/button"
```

## AI Tools and Resources

- **Cursor** — Primary development assistant for components, hooks, and refactors
- **shadcn/ui CLI** — Scaffolding for accessible UI primitives
- **Groq (via backend)** — AI suggestions proxied through the API; no API key in the frontend

## What I Would Improve With More Time

- **Clean Architecture** — Extract a domain layer (entities, use cases) from `lib/` so components and hooks depend on abstractions, not Axios or Zustand directly; useful if the app grows feature modules or needs offline/sync logic.
- **Persist sort/filter preferences** — Save view settings per team in `localStorage` or user settings API
- **Persist manual task order** — Sync drag-and-drop order to the backend
- **Virtualized lists** — `@tanstack/react-virtual` for large task lists
- **Keyboard DnD** — Fuller keyboard support and focus management for board view
- **Component tests** — React Testing Library for task modal, filters, and DnD flows
- **E2E tests** — Playwright coverage for signup → create task → AI suggest → save
- **Error boundaries** — Graceful fallbacks per route/section
- **Dark mode polish** — Audit contrast and status colors in both themes
- **Mobile layout** — Dedicated board UX for small screens (sheet-based columns)
