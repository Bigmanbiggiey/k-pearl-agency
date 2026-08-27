# K Pearl Agency

Modern property discovery and housing-agency website for **K Pearl Agency**.

K Pearl Agency is a Kenya-focused real-estate / housing agency website inspired by the existing Rental Hunt KE project, but intentionally redesigned around an agency-first business model rather than a broad rental marketplace.

## Stack

- React + TypeScript + Vite
- Tailwind CSS v4
- React Router
- Supabase: PostgreSQL, Auth, Storage, Realtime where justified
- TanStack Query
- React Hook Form + Zod
- Vitest + Testing Library
- Optional Leaflet/Map integration only if the approved requirements require it

There is **no Django, Express, or separate application backend**.

Read `CLAUDE.md` before making development changes.

## Getting started

Requires Node 24 (see `frontend/.nvmrc`).

```bash
cd frontend
npm install
cp .env.example .env      # then fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm run dev               # http://localhost:5173
```

Other scripts (run from `frontend/`):

| Script | Purpose |
|---|---|
| `npm run typecheck` | `tsc --noEmit`, strict |
| `npm run lint` | ESLint, `--max-warnings=0` |
| `npm run format` / `format:check` | Prettier write / check |
| `npm run test` | Vitest |
| `npm run build` | `tsc -b && vite build` |

From the repo root, `npm run <dev|build|lint|typecheck|test>` proxies to `frontend/`.

## Status

Phase 1 (repository foundation): tooling, brand tokens, and an application shell
with routing and the layered architecture (`Page → Hook → Service → Repository →
Supabase`). Pages are navigable stubs. Feature work and the database begin after
`docs/business-owner-questionnaire.md` is answered — see `docs/project-state.md`.
