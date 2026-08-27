# K Pearl Agency — Project State

## Current status

**Phase:** 2 — Supabase foundation *(in progress)*

**State:** Phase 0 approved; Phase 1 foundation built (branch
`chore/phase-1-foundation`, gates green). Business-owner questionnaire returned
2026-08-27 and every open decision resolved (`docs/phase-0-decision-register.md`
Resolutions; ADR-009 / ADR-010 added). `docs/database.md` finalised to **v2.0**.
Phase 2 now unblocked — building the local Supabase stack, migrations, RLS, seed,
types and the property read paths.

```
Phase 0  ── approved 2026-08-27
  ↓
Phase 1 (Repository foundation)   ── shell + tooling done
  ↓
Phase 2 (Supabase foundation)     ← in progress (local-first; hosted project is an owner handoff)
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

**Phase 2 execution** (plan: `C:\Users\PCMF\.claude\plans\bubbly-plotting-gray.md`):
1. `supabase init` + migrations + RLS + seed + storage against the local Docker stack.
2. Generate `frontend/src/types/database.types.ts`.
3. Wire property **read** paths (list/detail/featured) + author the Zod schemas.
4. Integration test against local Supabase; keep all gates green.
5. `notify-lead` Edge Function scaffold (wiring is Phase 5).

**Owner handoffs (parallel):** create the GitHub remote + push the branch;
create the hosted Supabase project; begin Meta Business verification for
+254704061324; brief a designer / supply photography; line up legal review.

## Change log

### 2026-08-27
Initial project foundation created.

### 2026-08-27 (later)
Phase 0 discovery completed. Added `docs/product-definition.md` and proposed ADR-002…ADR-008.

### 2026-08-27 (approval-gate preparation)
Consistency audit (PASS WITH OPEN DECISIONS; C1–C7). Added `docs/phase-0-decision-register.md`, `docs/business-owner-questionnaire.md`, `docs/database-readiness.md`.

### 2026-08-27 (Phase 0 approved · Phase 1 started)
Project owner accepted ADR-002 … ADR-008. Initialised git. Built the Phase 1 repository foundation on `chore/phase-1-foundation`: pinned dependencies + lockfile, full tooling config, brand tokens, application shell with routing and the layered architecture scaffold, and smoke tests. All local quality gates pass. Phase 2 remains blocked on the business-owner questionnaire.

### 2026-08-27 (questionnaire returned · Phase 2 started)
Business owner returned the questionnaire. Resolved every open decision (`docs/phase-0-decision-register.md` v2.0). Net new scope: short-let listing type + `price_period`; `areas` reference table; `property_submissions` review queue (ADR-009); agents edit only assigned properties (ADR-007 refined); custom `notify-lead` Edge Function, email-first, WhatsApp later (ADR-010); launch on `K-Pearl-Agency.vercel.app`; Vercel Web Analytics. Finalised `docs/database.md` to v2.0 and synced product-definition / requirements / roadmap / deployment / security / content-plan. Began Phase 2 (Supabase foundation).
