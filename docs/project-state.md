# K Pearl Agency — Project State

## Current status

**Phase:** 3 — Public website *(complete on branch `feat/public-website`)*

**State:** Phases 0–2 done. Phase 3 built the public marketing site: Home
(hero + inline search + featured/latest cards), About, Services (4 sections),
Contact (live `site_settings`), Areas, Privacy/Terms scaffolds, a real Property
Detail page with a gallery lightbox, and a styled 404 — plus per-route metadata,
OG, canonical, `robots.txt`, build-time `sitemap.xml`, JSON-LD (ADR-011),
self-hosted Fraunces + Inter, Vercel Web Analytics, a mobile nav drawer, and
route-level code splitting. All five quality gates green; **25/25 tests pass**
(8 unit/component + integration).

```
Phase 0  ── approved 2026-08-27
Phase 1 (Repository foundation)   ── done
Phase 2 (Supabase foundation)     ── done locally; owner to create the hosted project + db push
Phase 3 (Public website)          ── done (feat/public-website)
Phase 4 (Property catalogue)      ← next: /properties list, search, filters, pagination
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

## Current next task

**Next: Phase 4 — Property catalogue.** `/properties` list page, keyword search,
filters (listing type / property type / area / price / bedrooms / verified),
pagination, sort. The hero search on Home and the area chips on `/areas` already
navigate to `/properties?…` with query params for Phase 4 to consume. (Needs a
plan + approval before execution.)

**Status of handoffs:**
- ✅ GitHub: `github.com/Bigmanbiggiey/k-pearl-agency`. Branches: `main` (scaffold),
  `chore/phase-1-foundation` (Phases 0–2), `feat/public-website` (Phase 3).
  Recommend merging the Phase 0–2 → Phase 3 work to `main` via PR.
- ⏳ Hosted Supabase project — owner to create, then `supabase link` + `db push`
  (`20260827090012_reference_data` seeds `areas` + `site_settings`; dev `seed.sql`
  is not applied to production). See `docs/supabase-setup.md`.
- **Deferred to post-launch:** Meta Business verification for +254704061324
  (WhatsApp alerts). Launch ships with email + in-dashboard alerts only (ADR-010).
- **Property photography:** entered via the admin panel during Phase 6 testing —
  no pre-supplied files. Cards/detail show a branded placeholder until then.
- **Logo variants** (transparent / vector / lockup / favicon) — designer handoff (25.b).
- **Legal:** Privacy/Terms are placeholder scaffolds; lawyer review needed before
  launch (Phase 7).
- **Draft site copy** in `frontend/src/content/*` needs owner review/approval.

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

### 2026-08-27 (Phase 2 — Supabase foundation complete locally)
`supabase init` + 11 migrations implementing `docs/database.md` v2.0 (tables, `public_*` views, RLS, storage, auth trigger, KP-#### sequence). Local ports remapped to 553xx to coexist with another local Supabase stack. Seed: 28 Nairobi-metro areas, real `site_settings`, 2 dev staff, 8 sample properties. Generated `frontend/src/types/database.types.ts`. Wired the property **read** paths (`propertyService`/`propertyRepository` → `public_properties`/`public_property_media`) + `areaRepository` + the four Zod schemas. `notify-lead` Edge Function scaffolded. 11/11 tests pass (3 smoke + 8 local-Supabase integration); RLS also verified via psql (agent assigned-only, admin any, admin-only featured/verified, anon sees only published). All five gates green. Later: pushed to `github.com/Bigmanbiggiey/k-pearl-agency`; moved `areas`+`site_settings` into `20260827090012_reference_data` so `db push` needs no manual SQL; added `docs/supabase-setup.md`.

### 2026-08-27 (Phase 3 — Public website)
Branch `feat/public-website`. Built the public marketing site: Home (dark hero + inline property search + featured/latest `PropertyCard` grids + services + why-us + owner CTA), About, Services (4 sections from `src/content/services.ts`), Contact (live `useSiteSettings` → tap-to-call / `wa.me` / `mailto:`), Areas (grouped by county), Privacy/Terms scaffolds with review banner, Property Detail (`useProperty` → facts / description / amenities / gallery lightbox / WhatsApp CTA prefilled with the reference code), styled 404. SEO: `<Seo>` via React 19 metadata hoisting, JSON-LD `RealEstateListing`, `public/robots.txt`, build-time `scripts/generate-sitemap.mjs` (ADR-011). Added deps: `@fontsource-variable/{fraunces,inter}` (25.a), `@vercel/analytics`, `@radix-ui/react-dialog`. Router converted to `React.lazy` per route + vendor `manualChunks`. Copy drafted in `src/content/*` (pending owner approval). 25/25 tests pass; all five gates green.
