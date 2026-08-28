# K Pearl Agency — Architecture Decision Records

## ADR-001 — Supabase instead of Django

**Status:** Accepted

K Pearl will use Supabase as the backend platform.

### Context
The site needs authentication, PostgreSQL data, property media storage and secure authorization, but does not currently justify a full Django application server.

### Decision
Use Supabase Postgres + Auth + Storage + RLS. Use Edge Functions only for workflows requiring server-side secrets or privileged execution.

### Consequences
- Smaller codebase.
- Faster MVP development.
- Lower operational overhead.
- Security depends heavily on correct RLS design.
- Complex domain logic may eventually justify a separate backend, but not for MVP.

---

> ADR-002 through ADR-008 below were Proposed outputs of the Phase 0 discovery
> (`docs/product-definition.md`) and were **Accepted by the project owner on 2026-08-27**.
> They now govern implementation from Phase 1 onward.

## ADR-002 — Agency-first product model (not a marketplace)

**Status:** Accepted — 2026-08-27

### Context
K Pearl's reference project (Rental Hunt KE) is a tenant-facing rental marketplace with public accounts. K Pearl's branding ("MARKETING REAL ESTATE, CREATING VALUE") and `CLAUDE.md` frame it as a single agency's shopfront and lead-generation site.

### Decision
Build an agency website with a staff-managed property catalogue and lead capture. No peer-to-peer listing, no public marketplace mechanics.

### Consequences
- Simpler data model and permissions.
- Public experience optimised for discovery → contact, not transactions.
- Marketplace features (public accounts, UGC, payments) stay out of scope.

## ADR-003 — Catalogue covers rentals, sales and short-lets

**Status:** Accepted — 2026-08-27 · **Amended 2026-08-27** (questionnaire Q3)

### Context
The tagline centres on marketing/selling real estate; the logo shows both residential and skyline/commercial imagery. The business owner confirmed K Pearl also handles short-stay / furnished lets.

### Decision
`properties.listing_type ∈ {rent, sale, short_let}`. A nullable `price_period ∈ {month, night, week}` carries the rate basis (`month` for rent, `night`/`week` for short-let, null for sale). Lifecycle ("let **or** sold") is shared.

### Consequences
- Property search must expose a listing-type filter with three options.
- Cards and the detail page must render price with its period (e.g. "KES 8,000 / night").
- Additional agency services (marketing, letting support, property search for clients, relocation) are presented as **content + lead capture**, not software workflows. Landlord representation, property management and valuation are **not** offered (questionnaire Q5).

## ADR-004 — No external-owner entity or portal in MVP

**Status:** Accepted — 2026-08-27 · **Amended by ADR-009** (questionnaire Q13)

### Context
K Pearl will represent external landlords/owners, but tracking owners, commissions, and multiple properties per owner as structured data is a CRM concern, not a launch concern.

### Decision
Every published property is a staff-created listing. No `owners` table, no owner authentication, no owner login. Owners *may* submit structured listing details through a public form — see **ADR-009** — but those land in a staff review queue and are never auto-published.

### Consequences
- Adding an owner entity/portal later is a clean additive migration (`owners` + nullable `properties.owner_id`).
- Nullable internal owner-contact fields (`owner_name/phone/email`) are added to `properties` now (questionnaire Q17), staff-only, optional.

## ADR-005 — No public user accounts in MVP

**Status:** Accepted — 2026-08-27

### Context
Public accounts in the reference project exist mainly to power favorites and alerts. Those features do not justify the auth, support, and security surface of public registration for K Pearl's launch.

### Decision
Supabase Auth is **staff-only** in MVP. Favorites, if built, use `localStorage` with no account. Saved searches and email alerts are deferred.

### Consequences
- Smaller attack/support surface.
- Public accounts can be added later as an additive, self-contained auth flow.

## ADR-006 — Viewing requests are capture-only (no scheduler) in MVP

**Status:** Accepted — 2026-08-27

### Context
`CLAUDE.md` and `docs/requirements.md` explicitly exclude a complex appointment/calendar system.

### Decision
`viewing_requests` captures property, contact details, preferred date/time (coarse), and a message. Staff coordinate manually. Lifecycle: `new → scheduled → completed → cancelled`. Kept as its own table.

### Consequences
- No calendar integration, reminders, or sync in MVP.
- Revisit only if lead volume makes manual coordination painful.

## ADR-007 — Two-role staff model for MVP

**Status:** Accepted — 2026-08-27 · **Refined 2026-08-27** (questionnaire Q21)

### Context
`docs/database.md` suggested `admin | agent | editor`. There is no editable CMS content in MVP, so `editor` has nothing to do.

### Decision
MVP roles are **`admin`** and **`agent`**, enforced by RLS on `profiles.role`.
- `agent`: `SELECT` the whole catalogue and all leads; `INSERT` properties; `UPDATE`/`DELETE` **only** properties (and their media) where `agent_id = auth.uid()`; update lead status / assignment / notes.
- `admin`: everything, plus `featured`/`verified`, any property, `areas`, `site_settings`, `profiles`, and submission convert/decline.

`editor` is introduced later alongside a CMS.

### Consequences
- Simpler policies and onboarding.
- Property RLS must key `UPDATE`/`DELETE` on `agent_id`; an assignment step (admin sets `agent_id`) is part of property creation and lead triage.
- Adding `editor` later is an additive change.

## ADR-008 — Remain on Vite SPA; revisit prerendering post-launch

**Status:** Accepted — 2026-08-27 — note, not a migration

### Context
Public property pages need SEO. `docs/architecture.md` §6 says document any move away from the Vite SPA before making it.

### Decision
Stay a Vite SPA for MVP. Handle SEO with per-route metadata, Open Graph, canonical URLs, `robots.txt`, `sitemap.xml`, and JSON-LD. After launch, evaluate build-time prerendering / static generation (still on Vite) using Search Console data. Do not adopt SSR without a new ADR.

### Consequences
- No framework migration in MVP.
- A concrete, data-driven trigger for the next SEO decision.
- **Launch host (questionnaire Q28):** `K-Pearl-Agency.vercel.app` (Vercel). A custom domain is deferred to post-launch; the SPA + meta/JSON-LD approach still applies, and a `*.vercel.app` subdomain indexes but carries less authority — acquiring a `.co.ke`/`.com` domain is a recommended early post-launch step.

## ADR-009 — Owner property submissions: structured, queued, staff-converted

**Status:** Accepted — 2026-08-27 (amends ADR-004; questionnaire Q13)

### Context
The owner wants a public "List your property" form, but submissions must **not**
auto-publish. Staff need to see them in a queue, edit the submitted details, and
then decide whether to turn them into a listing.

### Decision
A dedicated `property_submissions` table captures the submitter's contact details
plus proposed listing fields (title, listing type, property type, area, price,
beds/baths, description). Public role may `INSERT` only (column allowlist, status
forced to `new`); it cannot read submissions back. Staff review, edit in place,
and either **convert** (creates a `properties` row in `draft`, links
`converted_property_id`) or **decline**. No owner account, login, or status
visibility to the submitter beyond an on-page "received" confirmation.

### Consequences
- One new table + a staff "Submissions" panel (Phase 6) with a convert action that
  pre-fills a draft property.
- The `inquiries` table no longer needs an `owner_listing` type — it carries only
  `property_enquiry` and `general`.
- Adding a full owner portal later remains an additive change (ADR-004).

## ADR-010 — Lead notifications via a custom Edge Function, email-first

**Status:** Accepted — 2026-08-27 (questionnaire Q30 + follow-up)

### Context
The owner asked for a "WhatsApp bot" that alerts the assigned agent and the admin
on every new enquiry, viewing request and property submission. Business-initiated
WhatsApp messages must go through Meta's official WhatsApp Cloud API, which needs
one-time Meta Business verification of +254704061324 and template approval
(days–weeks). The project is otherwise being kept lean (launch on `*.vercel.app`,
Gmail contact).

### Decision
Build a single custom Supabase Edge Function, `notify-lead`, triggered by a
database webhook on insert into `inquiries` / `viewing_requests` /
`property_submissions`. It resolves recipients (the row's `assigned_to` agent, or
all admins when unassigned, **plus** every admin) and sends through a **swappable
`Sender` interface**:
- **Launch:** `emailSender` (Gmail SMTP via an app password stored as an Edge
  Function secret) **plus** in-dashboard unread badges.
- **Later:** `whatsappSender` (WhatsApp Cloud API) switched on once the owner
  completes Meta Business verification — a configuration change, no rearchitecting.

`profiles` gains a `whatsapp` column for routing.

### Consequences
- No third-party messaging vendor or fee.
- Launch does not depend on Meta's review timeline.
- The Gmail app password is a server-side secret — never in the frontend
  (`docs/security.md`).
- Realtime is still not used; the dashboard reads counts on navigation.

### Update (2026-08-27)
Meta Business verification for +254704061324 is **explicitly deferred to
post-launch** (owner's decision). MVP ships with `emailSender` + in-dashboard
badges only; `whatsappSender` is a post-launch enhancement, switched on via
`activeSenders()` once verification and template approval are done.

### Update (2026-08-28 — implemented in Phase 5)
`supabase/functions/notify-lead/` is fully implemented for the email path:
resolves recipients (assigned agent + all admins) with the service-role key and
sends via Gmail SMTP (`denomailer`); when `GMAIL_USER` / `GMAIL_APP_PASSWORD` are
unset it logs the intended email instead (local-dev behaviour). It is invoked
**fire-and-forget by the repositories** (`src/repositories/notifyLead.ts`) after a
successful insert, rather than via a database webhook — simpler and identical
across local/prod; the payload shape (`{ type, table, record }`) is
webhook-compatible so a DB webhook can replace it later. `config.toml` sets
`[functions.notify-lead] verify_jwt = false`. In-dashboard unread badges move to
Phase 6 (no dashboard yet). Owner bootstrap: `functions deploy` +
`secrets set GMAIL_USER GMAIL_APP_PASSWORD` (`docs/supabase-setup.md` §9).

## ADR-011 — Client-side SEO metadata + build-time sitemap; no SSR

**Status:** Accepted — 2026-08-27 (formalises the SEO approach under ADR-008)

### Context
Public property and content pages need SEO, but the MVP stays a Vite SPA
(ADR-008). React 19 hoists `<title>`, `<meta>` and `<link>` rendered anywhere in
the tree into `<head>`, so a helmet library is unnecessary.

### Decision
- A `<Seo>` component (`src/components/Seo.tsx`) renders title / description /
  canonical / Open Graph / Twitter tags per route, plus optional JSON-LD.
- Property detail pages emit `schema.org` `RealEstateListing` JSON-LD
  (`src/lib/seo.ts`).
- `public/robots.txt` is static; `sitemap.xml` is generated **at build time**
  (`scripts/generate-sitemap.mjs`, run after `vite build`) by querying the
  `public_properties` view for published slugs. It degrades to static-route-only
  when the database is unreachable (e.g. CI).
- No `react-helmet`, no SSR, no prerendering in MVP. Prerendering stays a
  post-launch evaluation (ADR-008).

### Consequences
- Zero SEO dependencies; metadata lives with each page.
- The sitemap is a build artifact — it refreshes on every deploy, which is
  sufficient at MVP listing volumes.
- If Search Console shows weak indexing after launch, revisit prerendering
  (a new ADR), not a framework change.

## ADR note — Typefaces (decision 25.a resolved)

**2026-08-27.** Self-hosted **Fraunces Variable** (display serif) + **Inter
Variable** (body), both SIL OFL, via `@fontsource-variable/*` (no Google Fonts /
external CDN). Wired through the `--font-display` / `--font-sans` tokens in
`src/styles/index.css`, so a later rebrand is a token change.

## ADR-012 — Staff authentication: Supabase Auth, invite-only, client guards over RLS

**2026-08-28 (Phase 6).**

### Context
`/staff/**` needs authentication for the first time. Decision 19.c / ADR-005:
no public signup — staff accounts are created by an administrator only. The
Phase 2 RLS model already enforces the entire authorization model (staff read
all; agents mutate only `agent_id = auth.uid()` rows; admin-only
`featured`/`verified` via the `enforce_property_admin_columns` trigger; admin-only
`areas` / `site_settings`; no anon SELECT on lead tables).

### Decision
- **Supabase Auth** (email + password). `AuthProvider` at the app root subscribes
  to `onAuthStateChange`, loads the caller's `profiles` row, and exposes
  `{ session, user, profile, isStaff, isAdmin, isLoading, signOut }` via `useAuth`.
- **Client guards are UX, not security.** `RequireStaff` redirects anon → 
  `/staff/login`; `RequireAdmin` gates the admin-only pages. The real boundary is
  RLS — every staff repository call is an ordinary anon-key request carrying the
  user's JWT.
- **Invite-only.** New staff are created by the `invite-staff` Edge Function
  (`verify_jwt = true`; it additionally verifies `profiles.role = 'admin'` with
  the service-role key, then `auth.admin.inviteUserByEmail(..., { redirectTo:
  '<SITE_URL>/staff/reset' })`, then sets the new profile's `full_name` + `role`).
  `/staff/reset` serves both the invite link and the password-recovery link
  (`detectSessionInUrl` is already on).
- **`config.toml`:** `[auth].enable_signup = false` blocks public signup;
  `[auth.email].enable_signup = true` keeps the email provider on so staff can
  *log in* (setting it `false` returns `email_provider_disabled` for every login).

### Consequences
- No new auth infrastructure; the browser only ever uses the anon key.
- A staff member with no `profiles` row (shouldn't happen — `handle_new_user`
  creates one) is treated as non-staff and shown an "not a staff account" notice.
- Deploying staff invites requires `supabase functions deploy invite-staff` +
  the service-role key in the function environment on the hosted project.
