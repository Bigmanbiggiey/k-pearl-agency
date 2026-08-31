# K Pearl Agency — Project State

## Current status

**Phase:** 7 — Quality and launch *(5 tranches merged to `main` (PR #1),
deployed to Vercel. One **performance tranche** still owed — live Lighthouse
is A11y 100 / SEO 100 but Perf 50–76. Then owner launch execution — see
`docs/roadmap.md`
"Owner launch checklist" and `docs/go-live-runbook.md`.)*

**State:** Phases 0–5 done. Phase 6 built the whole authenticated admin app
behind `/staff` in four tranches: (1) real Supabase Auth — `AuthProvider`/context,
`RequireStaff`/`RequireAdmin` client guards (RLS stays the boundary), login /
forgot / reset pages, role-aware `StaffLayout`, dashboard tiles from a new
`staff_dashboard_counts()` RPC; (2) property CRUD against the base `properties`
table + a Storage-backed media manager (upload, reorder, cover, alt text) with a
tabbed editor and lifecycle actions; (3) enquiry / viewing-request management
(status · assign · notes) and the property-submission review flow with
convert-to-draft via `convert_property_submission`; (4) admin Settings
(`site_settings` + areas) and Team, plus an `invite-staff` Edge Function
(`verify_jwt = true`, admin-checked, service-role invite). Also fixed
`[auth.email].enable_signup` (was `false` → disabled **all** email logins).
All five gates green; **79/79 tests pass** (20 files, incl. a staff-RLS
integration suite: agent owns-only, admin-any, featured trigger, submission
convert, non-admin `site_settings` denied).

```
Phase 0  ── approved 2026-08-27
Phase 1 (Repository foundation)   ── done
Phase 2 (Supabase foundation)     ── done locally; owner to create the hosted project + db push
Phase 3 (Public website)          ── done (feat/public-website)
Phase 4 (Property catalogue)      ── done (feat/property-catalogue)
Phase 5 (Lead generation)         ── done (feat/lead-generation)
Phase 6 (Staff dashboard)         ── done (feat/staff-dashboard)
Phase 7 (Quality and launch)      ← next: E2E, legal, Lighthouse/a11y/SEO audits, prod deploy
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

Phase 7's 5 tranches (E2E + CI Supabase; a11y + Lighthouse tooling; security
review; legal drafts + DPA 2019 checklist; deployment prep + SEO audit) are
merged to `main` via **PR #1**, and the site is deployed to
`k-pearl-agency.vercel.app`. Post-deploy work since:

- **PR #4** — smoke test found every heading on a dark band (hero,
  `PageHeader` ×7 pages, home CTA) rendering near-black on near-black
  (invisible on the live site); fixed with one base CSS rule + a
  contrast-ratio E2E guard. `main` head `fea7df8`.
- **Live Lighthouse (mobile):** A11y **100** / SEO **100** on all 4 public
  pages (targets met); Best-practices 96 (Vercel Analytics 404).
  **Performance 50–76 — misses ≥90.** CLS 0.30–0.37 from async content
  shifting layout; LCP 3–7 s from SPA cold-start. Full trace +
  recommendations in `docs/launch-audit.md` §Performance.

**Still owed — development:** a **performance tranche** (reserve space for
async regions → CLS ≈ 0; dynamic-import the Supabase client; preload fonts +
`font-display: swap`; consider prerendering the shell), then re-run
Lighthouse for the ≥90 gate.

**Still owed — owner** (`docs/go-live-runbook.md`): **lawyer sign-off on
Privacy/Terms** (LAUNCH-blocking); Supabase console steps (first admin user,
auth URLs, `functions deploy` + secrets); enable Vercel Web Analytics; live
enquiry + staff-login smoke test; backup recovery drill; site-copy approval.
Deferred post-launch: WhatsApp sender, social image/favicon, CSP header,
custom domain. Not picked up: deeper staff component tests; a dashboard
"recent leads" list.

**Status of handoffs:**
- ✅ GitHub: `github.com/Bigmanbiggiey/k-pearl-agency`. **PR #1 merged to
  `main`** (2026-08-31, merge commit `9ccb51d`) — brought **Phases 1–7** onto
  `main`, which until then held only the Phase 0 scaffold. CI was green on the
  merge head. `feat/quality-launch` can be deleted.
- ✅ Hosted Supabase project (`k-pearl-agency`) created, linked, and fully
  current — `db push` confirmed all 14 local migrations applied
  (2026-08-31, Phase 7 tranche 3). Dev `seed.sql` was never applied, as
  intended. Still owner/console: deploy `invite-staff`/`notify-lead` +
  their secrets, auth redirect URLs, first admin user. See
  `docs/supabase-setup.md` and `docs/go-live-runbook.md` §1.
- **Deploy prep done (tranche 5):** `frontend/vercel.json` (SPA rewrite +
  security headers + asset caching), `frontend/.env.example`,
  `docs/go-live-runbook.md` (ordered launch steps), `docs/backup-recovery.md`
  (posture + drill). The Vercel project + deploy is an owner task —
  Root Directory must be `frontend`.
- **Deferred to post-launch:** Meta Business verification for +254704061324
  (WhatsApp alerts). Launch ships with email + in-dashboard alerts only (ADR-010).
- **Property photography:** entered via the admin panel during Phase 6 testing —
  no pre-supplied files. Cards/detail show a branded placeholder until then.
- **Logo variants** (transparent / vector / lockup / favicon) — designer handoff (25.b).
- **Legal:** Privacy/Terms are now full drafts from a Kenya-appropriate
  template (Phase 7 tranche 4), consent wording centralised, DPA 2019
  checklist written (`docs/legal-review.md`). Remaining: lawyer sign-off +
  owner actions (ODPC registration check, retention periods, processor
  agreements, breach/request runbooks) — all itemised in that doc.
  LAUNCH-blocking until done.
- **Draft site copy** in `frontend/src/content/*` needs owner review/approval.

## Change log

### 2026-08-31 (post-deploy smoke test + live Lighthouse)
First Vercel deploy succeeded (`fea7df8`; an initial failure was Vercel
building the stale pre-merge commit `1f9df54`). Browser smoke test of
`k-pearl-agency.vercel.app`: security headers all present, SPA deep-link
rewrite works, robots/sitemap correct, no crash. **Bug found + fixed (PR
#4):** headings on dark bands (hero `<h1>`, every `<PageHeader>` `<h1>`, home
CTA `<h2>`) rendered near-black on `bg-ink` — invisible; base
`h1..h4 { color: --color-ink }` beat the light `text-surface` inheritance.
One base rule (`.bg-ink :is(h1..h4) { color: --color-surface }`) + a
contrast-ratio guard in `e2e/a11y.spec.ts` (26 E2E specs now). **Live
Lighthouse (mobile):** A11y 100 / SEO 100 all 4 public pages; Best-practices
96 (Vercel Analytics `/_vercel/insights/script.js` 404 — owner toggle);
**Performance 50–76, misses ≥90** — CLS 0.30–0.37 (async content shifts
layout, e.g. Contact's `{settings ? … : null}` grows the page and jumps the
footer) and LCP 3–7 s (SPA cold-start). Recorded in `docs/launch-audit.md`
§Performance with a diagnosis; `docs/roadmap.md` now carries a
**performance tranche** as remaining dev work.

### 2026-08-31 (Phase 7 merged — engineering complete)
`feat/quality-launch` (tranches 1–5) opened as **PR #1** and merged to `main`
(merge `9ccb51d`); CI green on the merge head. Follow-up **PR #2** recorded
the merge in this file. All feature branches — `feat/quality-launch` plus the
six older phase branches — verified merged and deleted (local + remote);
`main` (`b9bd441`) is now the only branch. `docs/roadmap.md` Phase 7 marked
**engineering complete**, with a distinct "Owner launch checklist" (Vercel
deploy + Supabase console, post-deploy Lighthouse, backup drill, site-copy
approval, lawyer sign-off) and a "Deferred to post-launch" list. No code
change.

### 2026-08-31 (Phase 7 tranche 5 — deployment prep + SEO audit)
Branch `feat/quality-launch`. Added `frontend/vercel.json`: SPA rewrite
(`/(.*)` → `/index.html`, so deep links survive a hard refresh — Vercel
serves real `dist/` files first), conservative security headers
(`X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`,
`Permissions-Policy`, HSTS), and `immutable` caching for `/assets/*`. CSP
deferred to post-deploy (needs a live target to test). Added
`frontend/.env.example` (the two `VITE_` public vars — `lib/env.ts`'s own
error message pointed at a `frontend/.env.example` that didn't exist; the
repo-root one is left in place). **SEO audit:** new `frontend/e2e/seo.spec.ts`
(13 checks, runs in `npm run test:e2e` / CI) verifying per-route
title/description/canonical/OG/Twitter, `noindex` on filtered & paged
`/properties` views, one `RealEstateListing` JSON-LD on property detail, and
`/staff` kept out of the index; plus a manual pass on `robots.txt` /
`sitemap.xml` / `lang`.

**SEO defect found + fixed:** `index.html` shipped a static `<title>` and
`<meta name="description">`; React 19 only de-dupes tags it renders, so every
route had **two** of each (static + `<Seo>`). Removed both from `index.html`
(every route renders `<Seo>` on mount).

**Two pre-existing a11y bugs found + fixed** — tranche 2's `a11y.spec.ts` ran
axe before the SPA finished rendering; tranche 5 added a wait-for-`<h1>`
which surfaced them: `PropertyFilters.tsx` "Property type"/"Area" `<select>`s
had no accessible name (`select-name`, critical) → added `aria-label`;
`ContactPage.tsx` had a bare text `<div>` inside the contact `<dl>`
(`definition-list`, serious) → moved it to a `<p>`.

Real gap recorded (not fixed): `og:image`/favicon are still the 772 KB logo
PNG — designer handoff 25.b. New `docs/go-live-runbook.md` (ordered launch
steps: repo pre-flight → Supabase console → Vercel → smoke test → post-deploy
Lighthouse) and `docs/backup-recovery.md` (git-reproducible vs. must-back-up,
Supabase plan trade-offs, manual `db dump` + Storage export, a recovery-drill
procedure with a log table). Docs synced: `launch-audit.md` (§SEO + a11y
update), `roadmap.md` (SEO + backup ticked, deploy-prep row added),
`deployment.md` (runbook pointer), `project-state.md`. All five gates green;
79/79 unit+integration, all 22 E2E specs (4 journeys + 5 a11y + 13 SEO) pass
against a live local Supabase.

### 2026-08-31 (Phase 7 tranche 4 — legal content + DPA 2019 checklist)
Branch `feat/quality-launch`. Expanded `frontend/src/content/legal.ts` from
thin scaffolds into full draft Privacy Policy (structured as a Kenya Data
Protection Act 2019 privacy notice: controller identity, data collected,
purposes + lawful basis per purpose, recipients, international transfers,
retention, security, s.26 data-subject rights, ODPC complaint route,
cookieless analytics, children, changes) and Terms of Use (property-info
disclaimer, no-agency-agreement, acceptable use, IP, liability, Kenya
governing law). Kept `LEGAL_REVIEW_BANNER`; added `LEGAL_EFFECTIVE` draft
marker rendered on both pages. `LegalSection` reshaped to
`{ heading, body: string[], bullets?: string[] }`; `PrivacyPage`/`TermsPage`
render paragraphs + bullet lists. Consent-checkbox wording (decision I-3)
centralised as `CONSENT_STATEMENT` and consumed by `ConsentField.tsx` (Zod
schema messages untouched, existing form tests still green). New
`docs/legal-review.md` — the lawyer/owner handoff: what's built, the L1–L8
blanks to fill, a 17-item DPA 2019 compliance checklist (Done / Owner /
Lawyer), and a pre-launch sign-off gate. Advances decision-register 16.a,
22.b, I-3 — legal remains LAUNCH-blocking pending lawyer sign-off. Docs
synced: `roadmap.md` (two legal items → `[~]`), `content-plan.md`,
`project-state.md` handoffs. No schema/data-layer changes; integration suite
not exercised (local Supabase not running — tranche touches only content, one
component, docs). All five gates green.

### 2026-08-31 (Phase 7 tranche 3 — security review)
Branch `feat/quality-launch`. Reviewed `docs/security.md` against the repo
(RLS on all 8 tables, public views strip staff-only columns, storage policy,
no committed secrets, `verify_jwt` config) — all clean — and, read-only, via
the already-linked Supabase CLI, against the **hosted** project
(`k-pearl-agency`). **Real finding:** the hosted project's schema is two
migrations behind local (`20260828090001_lead_rate_limit`,
`20260828100001_staff_rpcs` never pushed) — production currently has no
lead-form rate limiting and a non-functional staff dashboard
(`staff_dashboard_counts`/`convert_property_submission` don't exist there).
Also confirmed no Edge Functions deployed and no secrets set (expected,
known owner handoff). Full findings in `docs/launch-audit.md`. Owner
confirmed pushing the fix; ran `supabase db push` — hosted project now has
all 14 local migrations applied, `migration list` confirms local ↔ remote
match.

### 2026-08-31 (Phase 7 tranche 2 — accessibility + Lighthouse audit)
Branch `feat/quality-launch`. Added `e2e/a11y.spec.ts` (axe-core via
`@axe-core/playwright`, zero serious/critical violations required) covering
Home/Properties/Property detail/Contact/staff Dashboard — runs as part of
`npm run test:e2e`, so it's enforced in CI alongside the tranche 1 suite.
**Real bug found:** `--color-gold-deep` (`src/styles/index.css`) was
`#a9863f`, ~3.4:1 contrast on ivory/white — under the WCAG AA 4.5:1 minimum
for normal-size text; only visible on the staff dashboard's small nav links,
since public-page usages happened to be large text (3:1 threshold). Darkened
to `#866a27` (~5.1:1); also fixed two light-surface wordmarks
(`StaffLayout.tsx`, `StaffAuthShell.tsx`) that used the lighter `--color-gold`
meant for dark surfaces, and switched `StaffAuthShell.tsx`'s hardcoded
`"K.pearl"` to `BRAND.wordmark` for consistency. Added
`scripts/lighthouse-audit.mjs` + `npm run audit:lighthouse` (production
build via `vite preview`, not dev — spawns vite's bin directly rather than
through `npx`/a shell, which was silently swallowing all output on Windows).
Accessibility ≥95 confirmed on all 4 public pages; Performance was NOT
reliably measurable on this dev machine (Docker + two local Supabase stacks
+ this session all running concurrently skewed Lighthouse's CPU-throttled
timing metrics — LCP ~7.5s despite only ~750ms of identified savings and a
near-perfect CLS of 0.001, the signature of host contention, not an app
defect). Recorded honestly in new `docs/launch-audit.md`, with a re-verify
against the real Vercel deploy queued for the deployment tranche. All five
gates green; 79/79 tests; all 9 E2E specs (4 journeys + 5 a11y) pass.

### 2026-08-31 (Phase 7 tranche 1 — E2E + real CI integration coverage)
Branch `feat/quality-launch`. Added Playwright (`@playwright/test`, pinned)
and `frontend/e2e/` with all four `docs/testing.md` minimum journeys;
`playwright.config.ts` drives the Vite dev server directly. CI
(`.github/workflows/ci.yml`) now starts a local Supabase stack (`start` +
`db reset`) before running the unit/integration suite and the new E2E suite —
the existing `*.integration.test.ts` files had silently `skipIf`'d in CI
since there was never a Supabase instance for them to reach; this is now a
real, enforced check for the first time. ADR-013 records the decision.
**Bug found by real E2E, not caught by any existing test:**
`src/features/staff/coerce.ts`'s `numberOrNull`/`emptyToNull` assumed their
RHF `setValueAs` input was always a string; react-hook-form also invokes
`setValueAs` against the field's raw typed default/reset value — `null` for
an empty numeric field, or a plain `number` after `reset(toForm(record))` —
crashing the property editor with "Cannot read properties of null (reading
'trim')" the moment a saved property's form re-registers. Fixed to handle
`string | number | null`. All five gates green; 79/79 unit+integration tests
pass against a live local Supabase; all 4 E2E specs pass.

### 2026-08-31 (Header wordmark fix)
Branch `fix/header-wordmark`. The supplied logo is a square full lockup —
at header render size its baked-in "K.pearl Agency" wordmark is illegible,
so the public and staff headers showed only an icon. Added
`BRAND.wordmark` (`content/site.ts`) and a live text wordmark next to the
mark in `Header.tsx` (desktop + mobile drawer) and `StaffLayout.tsx`
(replacing a hardcoded string). All five gates green.

### 2026-08-28 (Phase 6 — Staff dashboard)
Branch `feat/staff-dashboard`, four tranches. Added `@radix-ui/react-tabs`,
`@radix-ui/react-alert-dialog`, `@radix-ui/react-dropdown-menu`. Migration
`20260828100001_staff_rpcs` (`convert_property_submission`,
`staff_dashboard_counts`; both `security definer`, `revoke from public`, grant to
`authenticated`). New `src/features/auth/` (context + provider + `useAuth` +
`RequireStaff`/`RequireAdmin`) mounted at the app root; `src/features/staff/`
(hooks + `leadHooks` + `settingsHooks` + `ui/` — `StatTile`, `StatusBadge`,
`SaveBar`, `MediaManager`, `ConfirmButton`). Repositories gained their staff
methods: `property` (`listForStaff`/`getForStaff`/`create`/`update`/`slugExists`/
`setStatus`/`setFeatured`/`setVerified` against the base table), new
`propertyMedia`, `inquiry`/`viewingRequest` (`list`/`getById`/`updateStatus`/
`assign`/`updateNotes`), `propertySubmission` (`list`/`getById`/`setStatus`/
`convert`), `siteSettings.update`, `area` (`listAll`/`create`/`update`/
`setActive`), `profile.invite`. New services `staffProperty` (slug gen +
uniqueness; forces featured/verified/agent for non-admins) and `staffLeads`.
Pages: `pages/admin/Staff{Login,Forgot,Reset,Dashboard,Properties,PropertyEditor,
Submissions,Enquiries,Viewings,Settings,Team}Page`. Edge Function
`invite-staff` (`verify_jwt = true` + admin check + service-role
`inviteUserByEmail` → `/staff/reset`) + `config.toml` entry. **Config fix:**
`[auth.email].enable_signup` was `false`, which disables email logins entirely
(`email_provider_disabled`) — set to `true`; public signup stays blocked by
`[auth].enable_signup = false`. 79/79 tests (20 files), all five gates green.
**Owner step:** `supabase functions deploy invite-staff` on the hosted project.

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

### 2026-08-28 (Phase 5 — Lead generation)
Branch `feat/lead-generation`. Added `@hookform/resolvers`. New `src/features/lead-forms/` (EnquiryForm, ViewingRequestForm, ListPropertyForm, LeadDialog, useLeadSubmit, Honeypot, ConsentField) + form UI primitives in `components/ui/form.tsx`. Implemented the `inquiry` / `viewingRequest` / `propertySubmission` repositories (anon INSERT, no select-back) + services (Zod validate → map → repo) + `useCreate*` mutation hooks; `repositories/notifyLead.ts` fires the function. New migration `20260828090001_lead_rate_limit` (per-phone 45 s `BEFORE INSERT` trigger on the three lead tables, anon-only). `notify-lead` function fully written (jsr `@supabase/supabase-js`, `denomailer`) + `config.toml` `[functions.notify-lead] verify_jwt=false`. Placed the forms: Contact page, property detail dialogs, `/list-your-property` (+ `content/listProperty.ts`). Schema `z.uuid()` → `z.guid()` for id fields (seed/DB ids aren't v4). Verified: `functions serve` + POST → resolves the admin recipient and composes the email (logs, no secrets). 66/66 tests (17 files). **Owner step:** `supabase functions deploy notify-lead` + `supabase secrets set GMAIL_USER GMAIL_APP_PASSWORD` on the hosted project.

### 2026-08-27 (Phase 4 — Property catalogue)
Branch `feat/property-catalogue`. Built the `/properties` page on the existing data layer: `src/features/property-search/` (`filterParams` URL↔filters, `usePropertyFilters`, `PropertyFilters`, `ActiveFilterChips`, `SortSelect`, `Pagination`, `FiltersSheet`), `useProperties(filters)` hook with `keepPreviousData`, `useDebouncedCallback`, and `LISTING_TYPES`/`PROPERTY_TYPES` in `lib/format.ts`. `propertySearch.schema.ts` refactored to expose `propertySearchFields.shape` for lenient per-field URL parsing. `PropertiesPage` replaces the stub. Canonical stays `/properties`; filtered/paged views are `noindex`. 18 new tests (filterParams, usePropertyFilters, Pagination, PropertiesPage + 3 integration assertions) — 43/43 pass. No schema changes, no new dependencies.

### 2026-08-27 (Phase 3 — Public website)
Branch `feat/public-website`. Built the public marketing site: Home (dark hero + inline property search + featured/latest `PropertyCard` grids + services + why-us + owner CTA), About, Services (4 sections from `src/content/services.ts`), Contact (live `useSiteSettings` → tap-to-call / `wa.me` / `mailto:`), Areas (grouped by county), Privacy/Terms scaffolds with review banner, Property Detail (`useProperty` → facts / description / amenities / gallery lightbox / WhatsApp CTA prefilled with the reference code), styled 404. SEO: `<Seo>` via React 19 metadata hoisting, JSON-LD `RealEstateListing`, `public/robots.txt`, build-time `scripts/generate-sitemap.mjs` (ADR-011). Added deps: `@fontsource-variable/{fraunces,inter}` (25.a), `@vercel/analytics`, `@radix-ui/react-dialog`. Router converted to `React.lazy` per route + vendor `manualChunks`. Copy drafted in `src/content/*` (pending owner approval). 25/25 tests pass; all five gates green.
