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

## ADR-003 — Catalogue covers both rentals and sales

**Status:** Accepted — 2026-08-27

### Context
The tagline centres on marketing/selling real estate; the logo shows both residential and skyline/commercial imagery. Supporting sales alongside rentals costs roughly one enum, one filter, and one lifecycle state.

### Decision
`properties.listing_type ∈ {rent, sale}` for MVP (short-term lets deferred pending business input). Price semantics and lifecycle ("let **or** sold") account for both.

### Consequences
- Property search must expose a listing-type filter.
- Detail page and cards must present price context per listing type.
- Additional agency services (marketing, sourcing, landlord representation, management, valuation) are presented as **content + lead capture**, not software workflows.

## ADR-004 — No external-owner entity or portal in MVP

**Status:** Accepted — 2026-08-27

### Context
K Pearl will represent external landlords/owners, but tracking owners, commissions, and multiple properties per owner as structured data is a CRM concern, not a launch concern.

### Decision
Every property is a staff-created listing. No `owners` table, no owner authentication, no owner-submitted listings. "List your property" is a lead-capture form (`inquiries.type = 'owner_listing'`).

### Consequences
- Adding an owner entity later is a clean additive migration (`owners` + nullable `properties.owner_id`).
- Optional nullable internal owner-contact fields on `properties` may be added if staff need them from day one (open decision).

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

**Status:** Accepted — 2026-08-27

### Context
`docs/database.md` suggested `admin | agent | editor`. There is no editable CMS content in MVP, so `editor` has nothing to do.

### Decision
MVP roles are **`admin`** and **`agent`**, enforced by RLS on `profiles.role`. `featured`, `verified`, `site_settings`, and staff management are admin-only. `editor` is introduced later alongside a CMS.

### Consequences
- Simpler policies and onboarding.
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
