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
- [ ] Property enquiry form
- [ ] Viewing request form
- [ ] General contact form
- [ ] "List your property" structured submission form
- [ ] `notify-lead` full wiring: Gmail SMTP + in-dashboard badges (assigned agent + admin)
- [ ] WhatsApp/phone CTAs (tap-to-call, wa.me prefilled with reference code)
- [ ] Success/error states
- [ ] Spam/abuse protections (honeypot + rate limit)
- [ ] Consent checkbox (ties to legal)

## Phase 6 — Staff dashboard
- [ ] Staff authentication (invite-based, no signup)
- [ ] Dashboard shell (counts + recent leads)
- [ ] Property CRUD (assigned-agent RLS; admin any)
- [ ] Media management (upload, reorder, cover, alt text)
- [ ] Lifecycle: draft/publish/unpublish/unavailable/let_or_sold/archive
- [ ] Featured/verified controls (admin only)
- [ ] Property submissions review + convert-to-draft panel
- [ ] Inquiry + viewing-request management (status, assignment, notes)
- [ ] `site_settings` editor (admin)

## Phase 7 — Quality and launch
- [ ] Unit tests
- [ ] Integration/RLS tests
- [ ] E2E critical flows (Playwright)
- [ ] Draft Privacy/Terms from a Kenya-appropriate template → owner legal review
- [ ] Kenya Data Protection Act 2019 checklist
- [ ] Lighthouse (Perf ≥90, A11y ≥95)
- [ ] Accessibility audit
- [ ] SEO audit
- [ ] Security review (RLS, storage policies, Edge Function secrets)
- [ ] Production deployment to Vercel (`K-Pearl-Agency.vercel.app`)
- [ ] WhatsApp Cloud API sender (after owner's Meta Business verification)
- [ ] Backup/recovery verification

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
