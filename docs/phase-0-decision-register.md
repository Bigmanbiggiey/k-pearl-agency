# K Pearl Agency — Phase 0 Decision Register

> Version: 1.0
> Status: **OPEN — awaiting business-owner decisions**
> Source: converts the open decisions in `docs/product-definition.md` §31 into an approval questionnaire.
> Companion: `docs/business-owner-questionnaire.md` (plain-language version for the owner).

This document does **not** decide anything. It records every decision that Phase 0
surfaced, a recommendation, and space for the owner's answer. Nothing here is
approved until the **Owner decision** and **Status** columns are filled in and
`docs/project-state.md` is moved to "Phase 0 approved" **by a human**.

---

## How to read this

- **Blocks?** — `DEV` = blocks the start of development; `LAUNCH` = development can
  proceed with placeholders but the site cannot go live without it; `NO` = a
  sensible default is applied and the owner only needs to confirm.
- **DEFAULT — OWNER OVERRIDE OPTIONAL** in the recommendation column means a
  technical default has been chosen; the owner does not need to act unless they
  disagree.
- **Status** values: `OPEN`, `ANSWERED`, `DEFERRED (owner: name)`.

---

## Consistency audit (found while preparing this register)

| # | Finding | Severity | Proposed resolution |
|---|---|---|---|
| C1 | **Staff roles differ between documents.** `docs/database.md` suggests `admin \| agent \| editor`; `docs/product-definition.md` §19 + ADR-007 recommend `admin \| agent` only. | Medium | Approve ADR-007 (2 roles); `docs/database.md` reworked in the readiness pass. Decision **G-1** below. |
| C2 | **Repository contracts lag the workflow.** `docs/api-design.md` `PropertyRepository` has only `publish` / `archive`; the §9 lifecycle needs `unpublish` / `markUnavailable` / `markLetOrSold`. `InquiryRepository` has no `assign` method and no `type` filter, though §13/§28 add `assigned_to` and a `type` discriminator. | Medium | No code in Phase 0. `docs/api-design.md` to be updated in Phase 1 alongside the approved schema. Tracked here as audit item only — no owner decision required. |
| C3 | **Homepage structure described three ways.** `docs/ui-guidelines.md` ("Home page sections", 9 items incl. "How it works", "Selected areas / locations"), `docs/content-plan.md` ("Areas" section), and `docs/product-definition.md` §17 (Areas grid deferred to Phase 2, "How it works" compressed into Services). | Low | Adopt `product-definition.md` §17 as the reference; reconcile the other two in Phase 3 (Public website). Decision **N-4** below (Featured + Latest vs Featured only). |
| C4 | **Favorites.** `CLAUDE.md` §3 lists "Optional favorites for authenticated users" in the core public experience; `docs/product-definition.md` ADR-005 defers all public accounts and makes favorites a `localStorage`-only COULD-HAVE. | Low | ADR-005 narrows, does not break, `CLAUDE.md` ("optional"). Confirm via ADR-005 acceptance. Decision **ADR-005** below. |
| C5 | **`docs/requirements.md` FR-07** public-page list omits "List Your Property", which `product-definition.md` §16 includes as an MVP form. | Low | Superset, not a conflict. `requirements.md` already carries a Phase 0 note. No owner decision. |
| C6 | **No end-to-end test framework** in `frontend/package.json`, though `docs/testing.md` mandates E2E launch journeys. | Low | Phase 1 technical item. Decision **O-2** below (default: Playwright). |
| C7 | **Exact-address display** is discussed in `product-definition.md` §8/§12 ("optionally withheld") but was **not** listed as an open decision in §31. | Medium | Added here as **E-5**. Business/privacy decision. |

No contradictions were found that block the approval gate. Audit verdict: **PASS WITH OPEN DECISIONS.**

---

## A. Business Model

| ID | Question | Why it matters | Recommended answer | Alternative | Impact if changed | Blocks? | Owner decision | Status |
|---|---|---|---|---|---|---|---|---|
| 2.a | Does K Pearl market properties **to rent**, **to buy (sell)**, or **both**? | Determines `listing_type`, price semantics (monthly vs total), the property lifecycle end-state, and whether search needs a rent/sale filter. | **Both** (rentals + sales). | Rentals only; or sales only. | Removing sales: drop one enum value, one filter, the "sold" lifecycle branch. Adding sales later: additive migration + UI. | **DEV** | ______ | OPEN |
| ADR-002 | Accept "agency-first product model (not a marketplace)"? | Frames the entire product: staff-managed catalogue, lead capture, no peer-to-peer listing. | **ACCEPT** | Amend / reject. | Reject → the whole Phase 0 baseline is re-scoped. | **DEV** | ______ | OPEN |
| ADR-003 | Accept "catalogue covers both rentals and sales"? | See 2.a. | **ACCEPT** (contingent on 2.a = both). | Amend to one listing type. | See 2.a. | **DEV** | ______ | OPEN |

---

## B. Property Scope

| ID | Question | Why it matters | Recommended answer | Alternative | Impact if changed | Blocks? | Owner decision | Status |
|---|---|---|---|---|---|---|---|---|
| 2.c | Does K Pearl handle **commercial property** and/or **land** at launch, or **residential only**? | Adds property types, changes which spec fields apply (bedrooms/bathrooms become optional), affects filters and card layout. | **Residential + commercial**; land **only if K Pearl actually lists it**. | Residential only. | Adding commercial/land later is additive (new `property_type` values + conditional form fields). | **DEV** | ______ | OPEN |
| 2.d | Are **short-term / furnished lets** (nightly/weekly) in scope? | Adds a `listing_type` value and a rent period concept (`price_period`); affects availability display. | **No** for MVP. | Include `short_let`. | Adding later: one enum value + a period field + availability UI. | **DEV** | ______ | OPEN |

---

## C. Service Offerings

| ID | Question | Why it matters | Recommended answer | Alternative | Impact if changed | Blocks? | Owner decision | Status |
|---|---|---|---|---|---|---|---|---|
| 2.b | What is the **exact list of agency services** to present on the site, and the wording for each? | Drives the Services page sections, homepage service cards, and lead-form routing. | Sales/marketing, letting/rental support, property sourcing, landlord representation. (Wording to be supplied.) | Any subset/superset. | Content-only change; no schema impact. Page can be built with placeholder sections. | **LAUNCH** | ______ | OPEN |
| 7.a | Does K Pearl **offer property management** (rent collection, maintenance coordination) as a service? | The site must not advertise a service that isn't provided. Also signals whether an owner/management data model is eventually needed. | **Only include if genuinely offered**; as content + lead form, no workflow. | Omit entirely. | Content-only for MVP. | **LAUNCH** | ______ | OPEN |
| 7.b | Include **relocation / corporate services** section? | Same as 7.a. | Include as content only if offered. | Omit. | Content-only. | NO | ______ | OPEN |

---

## D. Locations

| ID | Question | Why it matters | Recommended answer | Alternative | Impact if changed | Blocks? | Owner decision | Status |
|---|---|---|---|---|---|---|---|---|
| 6.a | Which **counties / towns / areas** does K Pearl serve at launch? | The location filter is a controlled list; area landing pages (Phase 2) and homepage "areas" content depend on it. Seed/sample data needs real area names. | Owner to provide the list. Recommend starting with the counties/areas where K Pearl already has mandates. | A free-text location field (rejected — hurts filtering and consistency). | Expanding the list later is trivial (add rows). Switching to free-text is a schema + UX regression. | **DEV** | ______ | OPEN |

---

## E. Property Data

| ID | Question | Why it matters | Recommended answer | Alternative | Impact if changed | Blocks? | Owner decision | Status |
|---|---|---|---|---|---|---|---|---|
| 8.a | What **reference-code format** should listings use (shown in adverts and pre-filled into enquiries)? | Needs a rule before any listing exists; appears publicly. | `KP-####` (e.g. `KP-0042`), auto-assigned. **DEFAULT — OWNER OVERRIDE OPTIONAL.** | Any prefix/format the agency already uses. | Cosmetic; change before first publish is free. | NO | ______ | OPEN |
| 8.b | What are the **property categories** (types) to offer? | Controlled list for filters and the listing form. | Apartment, house, townhouse, maisonette, studio, bedsitter, commercial/office, shop/retail, land. (Trim to what K Pearl lists.) | Any subset/superset. | Adding/removing values is additive; keep the list short at launch. | **DEV** | ______ | OPEN |
| 8.c | Allow **"Price on request"** (hide the number) on some listings? | Determines whether `price` can be null and how cards/detail render. | **Yes.** | Price always required. | Making price optional later is a nullable-column migration + UI. | **DEV** | ______ | OPEN |
| 8.d | What **amenities** vocabulary should be offered (parking, borehole, lift, gym, balcony, furnished, pet-friendly, backup power, water, security, …)? | Controlled multi-select for the form and (COULD-HAVE) filter. | Owner to confirm a starter list of ~15–20. | Free-text amenities (rejected — inconsistent, unfilterable). | Adding terms later is trivial; existing listings unaffected. | **DEV** | ______ | OPEN |
| 8.e | Should the **exact street address** of a property be shown publicly, or only the area/neighbourhood? | Owner privacy, listing exclusivity, and safety. Affects which fields the detail page renders. | **Area + town + county publicly; exact address staff-only.** Optional approximate map pin later. | Show full address. | UI-only toggle if the field already exists; recommend storing address but not displaying it. | **DEV** | ______ | OPEN |
| 9.a | When a property is **temporarily off-market** (`unavailable`), should it be **hidden entirely** or shown as "temporarily unavailable"? | Public catalogue behaviour and SEO (keeping a URL live). | **Hidden** for MVP. | Show with a disabled state. | UI-only. | NO | ______ | OPEN |
| 9.b | Do agency workflows need an explicit **"under offer"** status distinct from "unavailable"? | Extra lifecycle state + staff training. | **No** — use `unavailable` for MVP. | Add `under_offer`. | One enum value + one button; additive. | NO | ______ | OPEN |
| 10.a | Should staff be able to **record the owner's contact details** against each listing from day one (internal only, not public)? | Adds nullable internal fields to the property record. Without it, owner details live only in the originating lead. | **Yes** — nullable internal `owner_name` / `owner_phone` / `owner_email` free-text, staff-only. | Defer until a full owner entity exists. | Adding later is additive; adding now avoids re-keying. | **DEV** | ______ | OPEN |

---

## F. Lead / Enquiry Workflow

| ID | Question | Why it matters | Recommended answer | Alternative | Impact if changed | Blocks? | Owner decision | Status |
|---|---|---|---|---|---|---|---|---|
| 13.a | When a lead is **closed**, should staff record an **outcome** (e.g. won / lost / no response / not proceeding), or just a free-text note? | Reporting later; small enum vs. free text. | Small enum + optional note. **DEFAULT — OWNER OVERRIDE OPTIONAL.** | Free text only. | Additive column; low risk. | NO | ______ | OPEN |
| 11.a | Property list **pagination**: numbered pages, or a "Load more" button? | UX and SEO (numbered pages are individually indexable). | **Numbered pages** (with a "Load more" affordance on mobile). **DEFAULT — OWNER OVERRIDE OPTIONAL.** | Infinite scroll (rejected — poor SEO/accessibility). | UI-only. | NO | ______ | OPEN |
| 28.a | If a property is ever deleted, what happens to **leads attached to it**? | Foreign-key delete behaviour. | `SET NULL` (keep the lead, detach the property). **Technical default — no owner input needed.** MVP archives rather than deletes anyway. | `RESTRICT` / `CASCADE`. | Schema-level; safe default chosen. | NO | ______ | OPEN |

---

## G. Staff & Permissions

| ID | Question | Why it matters | Recommended answer | Alternative | Impact if changed | Blocks? | Owner decision | Status |
|---|---|---|---|---|---|---|---|---|
| G-1 / ADR-007 | Approve a **two-role** staff model (`admin`, `agent`) for MVP, deferring `editor` until there is editable website content? | Drives every RLS policy. | **ACCEPT** (2 roles). | Keep 3 roles now. | Adding `editor` later is additive. Starting with 3 adds unused policy surface. | **DEV** | ______ | OPEN |
| 19.a | Can an **agent edit any property**, or only listings **assigned to them**? | RLS policy shape; team working style. | **Any property** (small team, shared catalogue). | Assigned-only. | Tightening later is a policy change, not a migration. | **DEV** | ______ | OPEN |
| 19.b | Can an **agent archive** a property, or only **request** archival (admin archives)? | RLS + process. | **Agent can archive.** | Admin-only archive. | Policy change only. | NO | ______ | OPEN |
| 19.c | How are staff **onboarded** — an admin creates the account, or the system sends an **invite email**? | Auth configuration; no public staff signup either way. | **Admin-triggered invite email.** No self-service registration. **DEFAULT — OWNER OVERRIDE OPTIONAL.** | Admin creates credentials manually. | Config-level. | NO | ______ | OPEN |
| 21.a | Require **two-factor authentication** for staff logins? | Security vs. friction for a small team. | **No MFA in MVP; revisit before scaling.** | Require MFA from day one. | Additive later. | NO | ______ | OPEN |
| ADR-004 | Accept "no external-owner entity or portal in MVP; owner interest captured as a lead"? | Keeps the data model and permissions small. | **ACCEPT.** | Build an owner entity now. | Owner entity is a clean additive migration later. | **DEV** | ______ | OPEN |
| ADR-005 | Accept "no public user accounts in MVP; favorites, if built, are `localStorage`-only"? | Removes the public-auth attack/support surface. Slightly narrows `CLAUDE.md` §3's "optional favorites". | **ACCEPT.** | Build public accounts now. | Public accounts can be added later as a self-contained flow. | **DEV** | ______ | OPEN |
| ADR-006 | Accept "viewing requests are capture-only; no calendar/scheduler in MVP"? | Matches `CLAUDE.md` §3 and `docs/requirements.md` FR-06. | **ACCEPT.** | Build a scheduler now. | Revisit only if lead volume demands it. | NO | ______ | OPEN |

---

## H. Contact Information

*(Development proceeds with placeholders wired to configuration; these block go-live.)*

| ID | Question | Why it matters | Recommended answer | Alternative | Impact if changed | Blocks? | Owner decision | Status |
|---|---|---|---|---|---|---|---|---|
| 15.a | Official **phone number(s)** for customers to call. | Shown in header, footer, and every property page; `tel:` links. | *(Owner to supply — not invented.)* | — | Editable post-launch (via `site_settings`, if built). | **LAUNCH** | ______ | OPEN |
| 15.b | Official **WhatsApp** business number. | Tap-to-WhatsApp with pre-filled message incl. reference code. | *(Owner to supply.)* | Reuse 15.a if it is a WhatsApp line. | Editable post-launch. | **LAUNCH** | ______ | OPEN |
| 15.c | Public **email address(es)** (general enquiries; separate owner/leasing address?). | `mailto:` links and the destination for lead notifications. | *(Owner to supply.)* One general address is enough for MVP. | Multiple role addresses. | Editable post-launch. | **LAUNCH** | ______ | OPEN |
| 15.d | Physical **office address** — publish one, or "by appointment only"? | About/Contact pages; possible map embed; ties to E-5. | *(Owner to decide + supply.)* | "By appointment." | Editable post-launch. | **LAUNCH** | ______ | OPEN |
| 15.e | Which **social media** platforms and handles should appear in the footer? | Footer icons/links. | *(Owner to supply; omit any not actively used.)* | None. | Editable post-launch. | NO | ______ | OPEN |
| 15.f | **Business hours** and any **response-time** statement to display. | Sets customer expectations. | *(Owner to supply, or omit.)* | Omit. | Editable post-launch. | NO | ______ | OPEN |

---

## I. Legal & Privacy

| ID | Question | Why it matters | Recommended answer | Alternative | Impact if changed | Blocks? | Owner decision | Status |
|---|---|---|---|---|---|---|---|---|
| 16.a | Who supplies **reviewed Privacy Policy and Terms of Use** copy? | The site collects personal data via forms; these pages must exist and be accurate before launch. | **Owner engages a lawyer or uses a professionally reviewed template.** The project wires the pages and a consent checkbox. | Project drafts unreviewed copy (not recommended). | Blocks go-live, not development. | **LAUNCH** | ______ | OPEN |
| 22.b | **Kenya Data Protection Act 2019** — what are K Pearl's obligations (privacy notice, lawful basis, handling data-subject requests, and whether registration as a data controller is required)? | Legal exposure; determines the privacy notice content and any registration step. | **Owner to obtain legal advice.** Assume a privacy notice + lawful-basis statement + a documented deletion process are required. | — | Blocks go-live. | **LAUNCH** | ______ | OPEN |
| I-3 | Wording of the **consent checkbox** on public forms. | Lawful basis for contacting the enquirer. | Short opt-in acknowledging the privacy notice. Part of 16.a. | No checkbox (not recommended). | UI-only. | **LAUNCH** | ______ | OPEN |

---

## J. Branding

| ID | Question | Why it matters | Recommended answer | Alternative | Impact if changed | Blocks? | Owner decision | Status |
|---|---|---|---|---|---|---|---|---|
| 25.b | Provide **additional logo assets**: transparent-background PNG, an SVG/vector master, a **horizontal lockup** for the site header, a **standalone pearl-in-shell mark** for favicon / social / app icons, and a **light-surface-safe** variant. | The only supplied file is a gold-on-black raster square — unusable as a header logo, favicon, or on light backgrounds. | **Owner (or their designer) supplies the asset pack.** | Project derives approximations from the raster (quality-limited, not recommended). | Header, favicon, and social previews depend on this. | **LAUNCH** | ______ | OPEN |
| 25.a | Confirm the **display (serif) and body (sans) typefaces**, with a web licence. | Defines the type system; performance budget. | A refined serif for headings + a clean sans for body, both web-licensed / open. Specific pairing proposed in Phase 1. **DEFAULT — OWNER OVERRIDE OPTIONAL.** | A brand typeface the owner already licenses. | Swapping fonts later is a token change. | NO | ______ | OPEN |
| J-3 | Confirm exact **brand colour values** (near-black, gold, ivory, charcoal, muted grey). | Design tokens. | Values proposed in `product-definition.md` §25.2 / Phase 1. **DEFAULT — OWNER OVERRIDE OPTIONAL.** | Owner-specified hex values. | Token change. | NO | ______ | OPEN |

---

## K. Email & Notifications

| ID | Question | Why it matters | Recommended answer | Alternative | Impact if changed | Blocks? | Owner decision | Status |
|---|---|---|---|---|---|---|---|---|
| K-1 | Should the site **email the agency** when a new enquiry or viewing request arrives? | Otherwise staff must check the dashboard to see new leads. Requires one Edge Function + an email provider. | **Yes — SHOULD-HAVE** for MVP. | Dashboard-only for MVP. | Additive; can ship shortly after launch. | NO | ______ | OPEN |
| 20.a | Which **transactional email provider** and **sending domain**? | Needed for K-1; the sending domain must be one K Pearl controls (ties to M-2). | **Resend** (or Postmark), sending from a subdomain of the agency domain. **DEFAULT — OWNER OVERRIDE OPTIONAL.** | SES; or the agency's existing SMTP. | Config-level. | NO | ______ | OPEN |

---

## L. SEO & Analytics

| ID | Question | Why it matters | Recommended answer | Alternative | Impact if changed | Blocks? | Owner decision | Status |
|---|---|---|---|---|---|---|---|---|
| 23.a | **Sitemap** generation: rebuilt at each deploy, or served from a live endpoint? | Freshness of newly published listings in search engines. | **Build-time regeneration on deploy**, acceptable for MVP listing volumes. **Technical default — no owner input needed.** | Runtime endpoint (Edge Function). | Implementation detail. | NO | ______ | OPEN |
| 26.a | **Error monitoring** tool. | Catching production errors. | **Sentry** (free tier). **DEFAULT — OWNER OVERRIDE OPTIONAL.** | A lighter alternative; or none at MVP (not recommended). | Config-level. | NO | ______ | OPEN |
| G.4 / L-3 | **Website analytics** — include at launch, and which tool? | Understanding traffic; **cookie-consent implications** interact with I (legal). | **Privacy-respecting analytics (Plausible or Umami) at launch** — avoids a cookie banner. **DEFAULT — OWNER OVERRIDE OPTIONAL.** | Google Analytics (adds consent-banner obligations); or none. | Adds a script + possibly a consent banner. | NO | ______ | OPEN |
| ADR-008 | Accept "remain on Vite SPA for MVP; evaluate prerendering after launch"? | Confirms no framework migration now. | **ACCEPT** (note, not a migration). | Commit to SSR/SSG now (premature). | A future ADR would cover any change. | NO | ______ | OPEN |

---

## M. Hosting & Domain

| ID | Question | Why it matters | Recommended answer | Alternative | Impact if changed | Blocks? | Owner decision | Status |
|---|---|---|---|---|---|---|---|---|
| G.1 / M-1 | **Frontend hosting** target. | Where the site is deployed; who owns the account and pays. | **Vercel** (or Netlify / Cloudflare Pages) on an account owned by K Pearl. **DEFAULT — OWNER OVERRIDE OPTIONAL.** | Any static host. | Deployment config. | NO | ______ | OPEN |
| G.2 / M-2 | **Domain name(s)** for the site. | Must be registered and controlled by K Pearl; also needed for the email sending domain (20.a). | *(Owner to provide / register.)* | — | Blocks go-live. | **LAUNCH** | ______ | OPEN |
| G.3 / M-3 | **Supabase project ownership** and **environment plan**. | Someone must own the Supabase organisation and billing; recommend separate local / staging / production. | **K Pearl owns the Supabase organisation**; project team granted access; 3 environments. | Single environment (not recommended). | Foundational for Phase 2. | **LAUNCH** | ______ | OPEN |

---

## N. Content

| ID | Question | Why it matters | Recommended answer | Alternative | Impact if changed | Blocks? | Owner decision | Status |
|---|---|---|---|---|---|---|---|---|
| G.5 / N-1 | Who **writes the site copy** (About, Services, "Why K Pearl", homepage text) and the **property descriptions**? | Copy must be real and owner-approved; no AI filler, no invented history or statistics (`docs/branding.md`). | **Owner supplies or approves all copy.** Project provides structure and placeholders. | Project drafts, owner reviews. | Blocks go-live, not development. | **LAUNCH** | ______ | OPEN |
| G.6 / N-2 | **Property and brand photography** — source and usage rights? | Photography is the primary visual element; must be licensed/owned. | **Owner supplies photography** with confirmed rights. | Licensed stock for brand imagery only (never for specific listings). | Blocks go-live. | **LAUNCH** | ______ | OPEN |
| 17.a / N-3 | Homepage: show **both "Featured" and "Latest" listings**, or **Featured only**? | Homepage layout and query count. | **Both.** **DEFAULT — OWNER OVERRIDE OPTIONAL.** | Featured only. | UI-only. | NO | ______ | OPEN |
| N-4 | Does K Pearl have **real testimonials** (with client consent) to publish? | Testimonials are Phase 2 and only ship with real, consented content. | *(Owner to advise; default: no testimonials section at launch.)* | — | Content-only, Phase 2. | NO | ______ | OPEN |

---

## O. Technical Preferences

*All items in this section are **DEFAULT — OWNER OVERRIDE OPTIONAL**. They are recorded for the technical lead, not the business owner. None block the approval gate.*

| ID | Question | Recommended default | Notes |
|---|---|---|---|
| O-1 | Accessible component primitives (dialogs, menus, comboboxes). | **Radix UI primitives** (unstyled) with Tailwind v4 styling. | Matches the reference project's a11y posture. |
| O-2 | End-to-end test framework (none present today). | **Playwright.** | Fills the gap flagged in audit item C6. |
| O-3 | Code formatter. | **Prettier** + `eslint-config-prettier`. | Or Biome; decide in Phase 1. |
| O-4 | Package manager / Node version. | **npm**, **Node 20** (matches CI). Add `.nvmrc` + `engines`. | See `product-definition.md` §30 T2, T15. |
| O-5 | Image handling. | Responsive `srcset` + lazy-load; use Supabase image transformations only if the chosen plan includes them, else build/client-side resizing. | Cost-sensitive; confirm with M-3 plan. |
| O-6 | Max upload size / count per property (22.a). | **8 MB per image, up to ~20 images per property.** | Enforced in the storage policy. |
| O-7 | Head/metadata management library. | `react-helmet-async` or equivalent. | For SEO (§23). |
| O-8 | Repository-contract updates (audit C2). | Update `docs/api-design.md` in Phase 1 to add `unpublish` / `markUnavailable` / `markLetOrSold` and inquiry `assign` / `type` filtering. | No owner input. |

---

## Decision-burden summary

| Category | Count |
|---|---|
| **Block development** (must be answered before Phase 1 feature work) | **10** — 2.a, 2.c, 2.d, 6.a, 8.b, 8.c, 8.d, 8.e, 10.a, 19.a (+ accept ADR-002/003/004/005/007, G-1) |
| **Block launch** (development can start with placeholders) | **10** — 15.a, 15.b, 15.c, 15.d, 16.a, 22.b, G.2, G.3, G.5, G.6, 25.b *(11 lines; 15.a–d count as the "contact pack")* |
| **Quick confirmations** (default applied; ~1 line each) | ~10 — 2.b, 7.a, 9.a, 9.b, 13.a, 11.a, 19.b, 19.c, 21.a, 17.a, 15.e, 15.f, K-1, ADR-006, ADR-008 |
| **Technical defaults** (no owner input) | ~12 — 8.a, 28.a, 23.a, 26.a, G.4, 25.a, J-3, 20.a, G.1, O-1…O-8 |

**Genuine business decisions the owner must actively make: ~20** (10 development-blocking + 10 launch-blocking), plus ~10 one-line confirmations. Everything else is a recommended default.
