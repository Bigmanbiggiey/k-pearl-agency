# K Pearl Agency — Roadmap

## Phase 0 — Product foundation

> Discovery output: **`docs/product-definition.md`** (Product Definition & Requirements
> Baseline) plus proposed ADR-002…ADR-008 in `docs/decisions.md`.
> Status: discovery complete, **awaiting human approval**. The items below are
> recommended in that document but are **not** approved until the business owner
> signs off and the open decisions in §31 are resolved.

- [ ] Confirm business services and exact target areas
- [ ] Confirm property listing types
- [ ] Approve MVP requirements
- [ ] Approve information architecture
- [ ] Approve brand/UI direction
- [ ] Approve staff roles
- [ ] Approve database design

## Phase 1 — Repository foundation
*(in progress — `chore/phase-1-foundation`; all quality gates green locally)*
- [x] Initialize Vite + React + TypeScript
- [x] Configure Tailwind v4
- [x] Configure linting/formatting
- [x] Configure testing
- [x] Configure Supabase client
- [x] Add environment handling
- [x] Add application shell
- [x] Add brand assets *(logo wired; provisional colour tokens pending decision J-3)*
- [ ] Push to a GitHub remote so CI runs
- [ ] Per-route code splitting (moved here from Phase 3 backlog)

## Phase 2 — Supabase foundation
*(complete locally — schema `docs/database.md` v2.0; branch `chore/phase-1-foundation`)*
- [x] `supabase init` + local stack (Docker); ports remapped to 553xx
- [x] Migrations: profiles+trigger, areas, properties, property_media, inquiries, viewing_requests, property_submissions, site_settings, public views, RLS, storage
- [x] Seed data (28 areas, site_settings, dev staff, 8 sample properties)
- [x] RLS policies (anon read via public views; agent = assigned-only; admin = all; admin-only featured/verified trigger)
- [x] Storage bucket `property-media`
- [x] Staff auth config (email/password, signup disabled, profile trigger)
- [x] Generate `frontend/src/types/database.types.ts`
- [x] Wire property **read** paths (list/detail/featured/media) + Zod schemas
- [x] `notify-lead` Edge Function scaffold (sender interface; wiring is Phase 5)
- [x] Integration tests (11/11 green: read paths + RLS boundary)
- [ ] Hand off: owner creates the hosted Supabase project; `supabase link` + `db push`

## Phase 3 — Public website
*(complete — branch `feat/public-website`; all gates green, 25/25 tests)*
- [x] Home (hero + search + featured + latest + services + why-us + owner CTA)
- [x] About
- [x] Services (4 sections: marketing/sales, letting, property search, relocation)
- [x] Contact (real phone/WhatsApp/email from `site_settings`, "by appointment", hours)
- [x] Areas we serve (from the `areas` table, grouped by county)
- [x] Privacy / Terms scaffolds (with "awaiting legal review" banner)
- [x] Property detail page + gallery lightbox *(pulled in from Phase 4)*
- [x] Responsive navigation/footer (mobile drawer; no social links)
- [x] SEO foundations (per-route meta, OG, canonical, robots.txt, build-time sitemap.xml, JSON-LD) — ADR-011
- [x] Vercel Web Analytics (`@vercel/analytics`)
- [x] Self-hosted fonts — Fraunces + Inter (decision 25.a)
- [x] Per-route code splitting + vendor chunks
- [x] Draft site copy in `frontend/src/content/*` for owner approval
- [ ] Logo-variant assets (transparent, horizontal lockup, favicon, light-surface) — designer handoff (25.b)

## Phase 4 — Property catalogue
*(complete — branch `feat/property-catalogue`; 43/43 tests, gates green)*
- [x] `/properties` list page + numbered pagination (decision 11.a)
- [x] Keyword search (debounced; `ilike` — Postgres FTS is a noted fast-follow)
- [x] Filters: listing type, property type (9), area (grouped by county), price range, bedrooms (n+), verified-only
- [x] URL-driven filter state (`usePropertyFilters` ↔ `filterParams`); shareable links
- [x] Desktop filter sidebar + mobile filter sheet (Radix Dialog); active-filter chips
- [x] Sort (newest / price ↑ / price ↓); empty / loading / error states
- [x] Deep-links from Home hero search and `/areas` chips consumed
- [x] Property detail + gallery *(built in Phase 3)*
- [x] "Price on request" + short-let price-period rendering *(built in Phase 3)*
- [x] Featured / latest properties *(built in Phase 3)*
- [ ] Real property photography (entered via the admin panel in Phase 6 testing)

## Phase 5 — Lead generation
*(complete — branch `feat/lead-generation`; 66/66 tests, gates green)*
- [x] Property enquiry form (dialog on the detail page)
- [x] Viewing request form (dialog on the detail page)
- [x] General contact form (Contact page)
- [x] "List your property" structured submission form (`property_submissions`, ADR-009)
- [x] `notify-lead` implemented: resolves recipients (assigned agent + admins) with the service-role key, emails via Gmail SMTP (`denomailer`); logs when secrets are absent. Invoked fire-and-forget by the repositories (a DB webhook can replace it later)
- [x] WhatsApp/phone CTAs (built Phase 3)
- [x] Success / error states + friendly rate-limit message
- [x] Spam/abuse: honeypot + min-submit-time (app) + per-phone 45 s DB rate-limit trigger (`20260828090001_lead_rate_limit`)
- [x] Consent checkbox linking to `/privacy`
- [x] In-dashboard "unread lead" badges → landed in Phase 6 (dashboard "Needs attention" tiles from `staff_dashboard_counts()`)
- [ ] Gmail secrets + `functions deploy` on the hosted project → owner (`docs/supabase-setup.md` §9)

## Phase 6 — Staff dashboard
*(complete — branch `feat/staff-dashboard`; 79/79 tests, gates green; 4 tranches)*
- [x] Staff authentication (invite-based, no signup): `AuthProvider`/context, `RequireStaff`/`RequireAdmin` client guards (RLS is the boundary), login / forgot / reset pages
- [x] Dashboard shell — `staff_dashboard_counts()` RPC → "Needs attention" + "Properties" tiles
- [x] Property CRUD against the base `properties` table (assigned-agent RLS; admin any); tabbed editor (Details · Location & owner · Media · Publishing) + sticky save bar
- [x] Media management (upload to Storage, up/down reorder, set cover, alt text, remove)
- [x] Lifecycle: draft/publish/unpublish/unavailable/let_or_sold/archive (inline quick actions; `published_at` stamped by DB trigger)
- [x] Featured/verified controls (admin only; enforced by the `enforce_property_admin_columns` trigger)
- [x] Property submissions review + convert-to-draft (`convert_property_submission` RPC → opens the new draft editor)
- [x] Inquiry + viewing-request management (status, assignment, internal notes)
- [x] `site_settings` editor + minimal areas manager (admin) · Team page + `invite-staff` Edge Function (admin-only; `verify_jwt = true`)
- [x] Fixed `[auth.email].enable_signup` — was `false`, which disabled **email logins entirely**; now `true` (public signup still blocked by `[auth].enable_signup = false`)

Follow-ups carried to Phase 7: deeper component tests for the editor / media
manager / submission convert; a "recent leads" list on the dashboard;
`functions deploy invite-staff` on the hosted project.

_Outcome:_ `functions deploy invite-staff` folded into the owner launch
checklist below. The deeper component tests and the "recent leads" list were
**not** picked up in Phase 7 — carry them into a post-launch polish pass or
drop them explicitly.

## Phase 7 — Quality and launch
*(engineering complete — 5 tranches, merged to `main` via PR #1; all gates
green, 79/79 tests + 22 E2E specs. What's left is owner launch execution, not
development — see "Owner launch checklist" below and `docs/go-live-runbook.md`.)*

- [x] Unit tests *(already in place from prior phases)*
- [x] Integration/RLS tests — now actually run in CI (ADR-013), not just
  locally
- [x] E2E critical flows (Playwright) — all 4 minimum journeys
  (docs/testing.md)
- [x] Privacy/Terms drafted from a Kenya-appropriate template — full drafts
  shipped (`frontend/src/content/legal.ts`, visible review banner + draft
  effective date). Lawyer sign-off → owner checklist.
- [x] Kenya Data Protection Act 2019 checklist — `docs/legal-review.md` §3;
  owner/lawyer actions itemised there.
- [x] Accessibility audit — automated (axe-core, `e2e/a11y.spec.ts`, enforced
  in CI); two real bugs found and fixed (AA contrast; unlabelled selects +
  invalid `<dl>`). `docs/launch-audit.md`.
- [x] SEO audit — every public route's title/description/canonical/OG/JSON-LD
  verified and enforced by `e2e/seo.spec.ts` in CI; robots + sitemap correct;
  fixed a duplicate-`<title>`/`<meta>` defect. Caveat: OG/social image +
  favicon still the raw logo PNG (designer handoff 25.b). `docs/launch-audit.md` §SEO.
- [x] Lighthouse — A11y ≥95 on all 4 public pages; script added
  (`npm run audit:lighthouse`). Real Perf ≥90 reading → owner checklist
  (needs the live Vercel deploy; local numbers are machine-noise).
- [x] Security review (RLS, storage policies, Edge Function secrets) —
  repo checks clean; found + fixed the hosted project's schema being 2
  migrations behind (`db push` applied, confirmed current). `docs/launch-audit.md`.
- [x] Deployment prep — `frontend/vercel.json` (SPA rewrite + security
  headers + asset caching), `frontend/.env.example`, `docs/go-live-runbook.md`.
- [x] Backup/recovery — posture documented (`docs/backup-recovery.md`):
  git-reproducible vs. must-back-up, Supabase plan trade-offs, manual backup
  commands, a recovery-drill procedure. The drill run → owner checklist.

### Owner launch checklist (not development — `docs/go-live-runbook.md`)

- [ ] Lawyer sign-off on Privacy/Terms; remove the review banner
  (`docs/legal-review.md` §5) — **LAUNCH-blocking**
- [ ] Production deployment to Vercel (`K-Pearl-Agency.vercel.app`) — Root
  Directory `frontend`, env vars, then Supabase console steps (first admin
  user, auth URLs, `functions deploy notify-lead`/`invite-staff` + secrets)
- [ ] Post-deploy Lighthouse against the live URL — confirm Perf ≥90
- [ ] Run the backup recovery drill once; log the date in `docs/backup-recovery.md`
- [ ] Owner review/approval of draft site copy (`frontend/src/content/*`)

### Deferred to post-launch

- [ ] WhatsApp Cloud API sender — after the owner's Meta Business
  verification for +254704061324 (ADR-010); launch ships email +
  in-dashboard alerts only
- [ ] Social share image (1200×630) + favicon — designer handoff (25.b)
- [ ] Content-Security-Policy header in `vercel.json` — add once there's a
  live deploy to test against

## Post-MVP candidates

- Custom domain (`.co.ke` / `.com`) — recommended early
- Favorites (localStorage, no account)
- Saved searches / email alerts
- Map view (Leaflet)
- Agent profile pages
- More advanced viewing scheduling
- Property-owner portal (login, submission status)
- Proper vector logo redraw
- AI-assisted property discovery

Post-MVP work requires explicit approval.
