# K Pearl Agency — Project State

## Current status

**Phase:** 1 — Repository foundation *(in progress)*

**State:** Phase 0 approved (ADR-002 … ADR-008 accepted 2026-08-27). Phase 1
application shell built on branch `chore/phase-1-foundation`; all quality gates
pass locally. **Phase 2 (database) is blocked** on the business-owner
questionnaire.

```
Phase 0  ── approved 2026-08-27 (ADRs accepted)
  ↓
Phase 1 (Repository foundation)   ← in progress; shell + tooling done
  ↓
Phase 2 (Supabase foundation)     ← BLOCKED on docs/business-owner-questionnaire.md
```

## Completed

### Phase 0
- Rental Hunt KE reviewed as architecture reference and product contrast.
- `docs/product-definition.md` — Product Definition & Requirements Baseline.
- `docs/phase-0-decision-register.md`, `docs/business-owner-questionnaire.md`, `docs/database-readiness.md`.
- Consistency audit: PASS WITH OPEN DECISIONS (items C1–C7).
- **ADR-002 … ADR-008 accepted by the project owner on 2026-08-27** (agency-first model, rentals + sales, no owner entity, no public accounts, capture-only viewings, two-role staff model, stay on Vite SPA). Recorded in `docs/decisions.md`.

### Phase 1 (branch `chore/phase-1-foundation`)
- Git repository initialised; branch created.
- All dependencies pinned to exact versions; `frontend/package-lock.json` committed. Stable-generation pins where absolute-latest breaks the ecosystem: **TypeScript 5.9** (typescript-eslint has no TS 7 support), **ESLint 9** (jsx-a11y / import plugins cap at 9), **Vite 7** (Vite 8 + plugin-react still maturing).
- Tooling: `tsconfig.json` (strict), `vite.config.ts` (React + Tailwind v4 plugins, inline Vitest config), flat `eslint.config.js` (typescript-eslint type-checked, react, react-hooks, jsx-a11y, import; `no-explicit-any`; `no-restricted-imports` enforces the Supabase-in-repositories-only rule), Prettier, `.nvmrc` (24). CI: Node 20 → 24, added `format:check`.
- Tailwind v4 CSS-first setup with `@theme` brand tokens (provisional, pending decision J-3).
- Application shell: `main.tsx` → `App` (RootErrorBoundary → QueryClientProvider → RouterProvider); public route tree under `PublicLayout` (Header/Footer, skip link), staff route tree under `StaffLayout` + `StaffAuthGuard` placeholder; UI primitives (Button/Card/Badge/Container); every route is a navigable stub via shared `PagePlaceholder`.
- `lib/`: Zod-validated `env`, single `supabase` client, `AppError` model (`docs/api-design.md` codes) + `notImplemented`, `queryKeys`.
- Layered stubs: `repositories/` (property/inquiry/viewingRequest — signatures match `docs/api-design.md` incl. the lifecycle + `assign` methods) and delegating `services/`; all throw `notImplemented()`.
- `types/domain.ts`: literal unions locked in by ADR-003/006/007; `database.types.ts` placeholder for Phase 2 generation.
- Smoke tests (3 passing): home header/heading, 404, staff shell.
- **Quality gates green locally:** `typecheck`, `lint` (`--max-warnings=0`), `format:check`, `test`, `build`. `npm run dev` serves the shell.
- Docs synced: `docs/api-design.md` (C2 — lifecycle + assign methods), `docs/project-structure.md` (actual tree), `docs/roadmap.md` (Phase 1 items), `README.md` (getting started).

## Blocked / not yet done

- **CI has not run** — no GitHub remote yet. Add a remote and push `chore/phase-1-foundation` to exercise `.github/workflows/ci.yml`.
- **Phase 2 (Supabase foundation)** — needs `docs/business-owner-questionnaire.md` answered, the `docs/phase-0-decision-register.md` decisions resolved, and `docs/database.md` reworked per `docs/database-readiness.md` and human-approved. No SQL, migrations, or Supabase project before that.
- Root `npm install` (supabase CLI) deferred to Phase 2.
- Real brand fonts / final colour hex (decisions 25.a / J-3); full logo asset pack (25.b).
- Contact details, legal copy, served-areas list, property types, amenities — all still open (see the decision register).

## Current next task

1. **Business owner completes `docs/business-owner-questionnaire.md`.**
2. Transcribe answers into `docs/phase-0-decision-register.md` (Owner decision / Status columns).
3. Rework `docs/database.md` per `docs/database-readiness.md`; human-approve it.
4. Create the GitHub remote; push `chore/phase-1-foundation`; confirm CI is green; open a PR.
5. Then start **Phase 2 (Supabase foundation)**: `supabase init`, migrations, RLS, storage, seed, generate `src/types/database.types.ts`.

## Change log

### 2026-08-27
Initial project foundation created.

### 2026-08-27 (later)
Phase 0 discovery completed. Added `docs/product-definition.md` and proposed ADR-002…ADR-008.

### 2026-08-27 (approval-gate preparation)
Consistency audit (PASS WITH OPEN DECISIONS; C1–C7). Added `docs/phase-0-decision-register.md`, `docs/business-owner-questionnaire.md`, `docs/database-readiness.md`.

### 2026-08-27 (Phase 0 approved · Phase 1 started)
Project owner accepted ADR-002 … ADR-008. Initialised git. Built the Phase 1 repository foundation on `chore/phase-1-foundation`: pinned dependencies + lockfile, full tooling config, brand tokens, application shell with routing and the layered architecture scaffold, and smoke tests. All local quality gates pass. Phase 2 remains blocked on the business-owner questionnaire.
