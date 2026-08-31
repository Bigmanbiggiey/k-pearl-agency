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

Requires Node 24 (see `frontend/.nvmrc`) and Docker (for the local Supabase stack).

```bash
# 1. Local backend (from the repo root) — Docker must be running
npx supabase start                       # applies migrations + seed
npx supabase status                      # prints the API URL + anon key

# 2. Frontend
cd frontend
npm install
cp .env.example .env                     # set:
#   VITE_SUPABASE_URL=http://127.0.0.1:55321
#   VITE_SUPABASE_ANON_KEY=<anon key from `supabase status`>
npm run dev                              # http://localhost:5173
```

Local Supabase ports are remapped to the **553xx** range (`supabase/config.toml`)
so this project can run alongside another local Supabase stack. Supabase Studio:
http://127.0.0.1:55323

Regenerate DB types after a migration change:

```bash
npx supabase gen types typescript --local > frontend/src/types/database.types.ts
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

Phase 2 (Supabase foundation): schema, migrations, RLS, storage and seed are in
`supabase/`; `docs/database.md` v2.0 is the contract. The frontend has the
application shell, the layered architecture (`Page → Hook → Service → Repository →
Supabase`), and the property **read** paths wired to the public views. Pages are
still stubs — public/staff feature UIs are Phases 3–6. See `docs/project-state.md`.
