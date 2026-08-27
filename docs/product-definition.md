# K Pearl Agency — Product Definition & Requirements Baseline

> Version: 1.0 (Phase 0 discovery output)
> Status: **DISCOVERY COMPLETE — AWAITING HUMAN APPROVAL**
> Date: 2026-08-27
> Owner of approval: K Pearl Agency business owner / project sponsor

---

## Legend — evidence classification

Every non-trivial statement in this document is tagged:

| Tag | Meaning |
|---|---|
| **[CONFIRMED]** | Verifiable from the supplied repository, branding asset, or `CLAUDE.md`. |
| **[ASSUMPTION]** | Carried forward from existing `docs/` without independent confirmation. |
| **[RECOMMENDED]** | A decision this document proposes; not yet approved. |
| **[OPEN DECISION]** | Requires business-owner input. Must not be guessed. |
| **[FUTURE]** | Deliberately deferred beyond MVP. |

No phone numbers, emails, office locations, service areas, staff names, listings, prices, claims, awards, experience figures, partnerships, or registrations are asserted anywhere in this document. Where such data is structurally required, it is wired to configuration placeholders and listed under **Open Decisions**.

---

## 1. Executive Summary

K Pearl Agency is an early-stage Kenyan real-estate agency. **[CONFIRMED]** The supplied logo carries the wordmark "K.pearl Agency" and the tagline "MARKETING REAL ESTATE, CREATING VALUE". **[CONFIRMED]**

The website's job is to be a **credible, premium shopfront and lead-generation engine** for the agency: let people discover properties the agency represents, understand the agency's services, and make contact quickly; and let agency staff manage listings and the leads that come in. **[ASSUMPTION, consistent with `docs/vision.md`]**

This is **not** a rental marketplace, **not** a peer-to-peer listing platform, and **not** a transactional/payments product. **[CONFIRMED — `CLAUDE.md` §3, §14]**

The reference project, Rental Hunt KE, is a tenant-facing rental discovery platform with public user accounts, favorites, maps, and realtime notifications. K Pearl reuses Rental Hunt's **engineering discipline and stack** but diverges on **product**: agency-first, sales + rental, staff-managed catalogue, no public accounts in MVP. **[CONFIRMED — `CLAUDE.md` §1; reference repo README]**

**Recommended MVP in one line:** a mobile-first marketing site (Home, Properties, Services, About, Contact, legal) with a PostgreSQL-filtered property catalogue, property-detail pages, enquiry and viewing-request forms, and a staff-only admin area for property and lead management — all on the already-chosen React + Vite + Tailwind v4 + Supabase stack, with no architectural change required. **[RECOMMENDED]**

**Nothing in this document authorises implementation.** See §33.

---

## 2. Business Model

### 2.1 Options considered

| Model | Description | Implication for the build |
|---|---|---|
| **A — Rental agency** | Site helps people find rentals only. | Single `listing_type`; simplest catalogue; "price" is monthly rent; lifecycle ends at "let". |
| **B — Sales + rental agency** | Site markets properties both to rent and to buy. | `listing_type` ∈ {rent, sale}; price semantics differ per type; lifecycle needs "let **or** sold"; filters must include listing type. |
| **C — Full-service real-estate agency** | Rentals, sales, marketing, sourcing, landlord representation, property management, commercial, land. | Everything in B, plus several of these become **service offerings** (content + lead capture), and some (management, owner representation) imply an **owner relationship** and possibly an owner entity. |

### 2.2 Signals from available material

- The tagline "**MARKETING** REAL ESTATE, CREATING VALUE" frames the business around **marketing/selling** property, not only letting it. **[CONFIRMED — logo]**
- The logo art combines **a house roofline and a high-rise skyline** — residential and larger/commercial or development property both implied. **[CONFIRMED — logo]**
- `docs/vision.md` lists potential services: property marketing, letting/rental support, sales, sourcing, landlord/owner representation, property management. **[ASSUMPTION — explicitly unconfirmed in that doc]**

### 2.3 Recommendation

**Adopt Model B for MVP** (sales + rental catalogue), and present the remaining Model C services (**marketing, sourcing, landlord representation, property management, valuation**) as **informational Services content with a lead form** — *not* as software workflows. **[RECOMMENDED]**

Rationale: Model B costs almost nothing extra over Model A (one enum, one filter, one lifecycle state) and matches the "marketing real estate" tagline. Full Model C workflow features (owner portals, management ledgers) are heavy, need business processes that do not yet exist, and are premature for a startup shopfront.

**[OPEN DECISION 2.a]** Confirm: rentals only, sales only, or both.
**[OPEN DECISION 2.b]** Confirm the exact list of agency services to name on the site.
**[OPEN DECISION 2.c]** Does K Pearl handle commercial property and/or land at launch, or residential only?
**[OPEN DECISION 2.d]** Short-term / furnished lets (Airbnb-style) — in scope or not? (Affects `listing_type` and price semantics.)

See **ADR-002** and **ADR-003** in `docs/decisions.md`.

---

## 3. Product Vision

**Vision (refined):** the trusted digital front door for K Pearl Agency, where a prospective client can within a few minutes understand what the agency does, see representative properties, and start a conversation — on a phone, on a slow connection, with confidence in the brand. **[RECOMMENDED, consistent with `docs/vision.md`]**

**What "done" looks like for MVP:**

A visitor can: understand the agency → browse properties → filter/search → open a detail page → enquire about a property → request a viewing or callback → contact the agency generally. **[ASSUMPTION — `docs/vision.md` MVP success list]**

A staff member can: sign in → add/edit/publish/archive properties → upload and order property images → mark featured/verified → review and progress enquiries and viewing requests. **[ASSUMPTION — `docs/vision.md`]**

**Explicitly out of the vision for MVP:** being a marketplace, hosting public accounts, processing money, scheduling calendars, or replacing the agency's human sales process. **[CONFIRMED — `CLAUDE.md` §3]**

---

## 4. Target Users

### 4.1 Property seekers (primary)
Tenants and buyers looking for residential (and possibly commercial/land — see 2.c) property. They arrive from search, social, or referral; most are on mobile. They want: fast browsing, honest information, photos, price, location, and a low-friction way to make contact. **[ASSUMPTION — `docs/user-stories.md` US-002…US-008]**
- *Sub-segment:* corporate/institutional clients (relocation, office space). Same public flows; no distinct software need at MVP. **[RECOMMENDED — treat as a Services audience, not a user type]**

### 4.2 Property owners / landlords (secondary)
People who want K Pearl to market, let, sell, or manage their property. **[ASSUMPTION — `docs/vision.md`]** MVP need: a **"List your property"** page that captures their details as a lead. **No owner account, no owner dashboard, no owner-submitted listings in MVP.** **[RECOMMENDED — see §10, ADR-004]**

### 4.3 K Pearl staff (internal)
Agency employees who manage the catalogue and respond to leads. **[ASSUMPTION]** MVP need: authenticated admin area for property CRUD, media, and lead management. Roles: see §14.

### 4.4 Not a user group in MVP
The general public as **registered members** (favorites, saved searches, alerts). Deferred — see §21, ADR-005. **[RECOMMENDED]**

---

## 5. User Problems

| # | User | Problem | MVP response |
|---|---|---|---|
| P1 | Seeker | "Is this agency real and competent?" | Premium, consistent brand; clear About/Services; verified badges; real photography. |
| P2 | Seeker | "Show me relevant properties fast, on my phone." | Mobile-first catalogue, few high-value filters, fast images, pagination. |
| P3 | Seeker | "I found one — how do I evaluate it without calling?" | Detail page: gallery, price, location, key facts, description, amenities, availability. |
| P4 | Seeker | "I want to talk to someone without friction." | Enquiry form, viewing request, tap-to-call, tap-to-WhatsApp. |
| P5 | Owner | "Can K Pearl market/manage my property?" | Services content + "List your property" lead form. |
| P6 | Staff | "Keep listings current without a developer." | Admin property CRUD, publish/unpublish, media management. |
| P7 | Staff | "Don't lose a single lead." | Central inquiries + viewing-requests lists with status, assignment, notes. |
| P8 | Business | "Be found on Google." | Slugs, metadata, sitemap, structured data, performance budget. |

---

## 6. Proposed Solution

A single React SPA (Vite) with two route trees on one Supabase backend:

```
Public (/)                         Staff (/staff, auth-gated)
  Home                               Login / password reset
  Properties (search + filters)      Dashboard (counts + recent leads)
  Property detail (/properties/:slug) Properties: list / create / edit
  Services                             lifecycle, media, feature, verify
  About                              Inquiries: list / view / status / assign / notes
  Contact                            Viewing requests: list / view / status / notes
  List your property                 Site settings (contact info)  [SHOULD-HAVE]
  Privacy / Terms
```

Data path is fixed by `CLAUDE.md` and unchanged: **Page → Feature/Hook → Service (Zod validation, rules) → Repository (Supabase queries, error normalisation) → Supabase (Postgres / Auth / Storage / RLS)**. No Supabase calls in components. **[CONFIRMED — `CLAUDE.md` §5, `docs/architecture.md`]**

Authorisation is enforced by **RLS**, not hidden UI. **[CONFIRMED — `CLAUDE.md` §7]**

Edge Functions: only one candidate in MVP scope — outbound email on new lead — and only as a **SHOULD-HAVE**. See §20. **[RECOMMENDED]**

---

## 7. Business Services (site content)

Presented on a single **Services** page with an anchor-linked section per service, each ending in a lead CTA. Exact wording is **[OPEN DECISION 2.b]**. Candidate set, from `docs/vision.md`:

| Service | MVP treatment | Notes |
|---|---|---|
| Property sales / marketing | Content + lead form | Core to the tagline. |
| Property letting / rental support | Content + lead form | Core. |
| Property sourcing (buyer/tenant brief) | Content + lead form | Simple to describe. |
| Landlord / owner representation | Content + "List your property" form | No workflow. |
| Property management | **[OPEN DECISION]** include as content only, or omit if not offered | Do not imply a service that doesn't exist. |
| Property valuation | **[FUTURE / Phase 2]** dedicated request page | Needs a defined intake process. |
| Relocation / corporate | **[OPEN DECISION]** content only if offered | |

**Rule:** the site must not advertise a service K Pearl does not actually provide. Each service section stays generic until the owner confirms scope and wording. **[CONFIRMED — `docs/branding.md` brand-tone rules]**

---

## 8. Property Model

Fields evaluated. "MVP" = needed at launch; "Optional" = add if data exists; "Future" = post-MVP; "Drop" = not worth modelling.

| Field | Verdict | Notes |
|---|---|---|
| `title` | **MVP** | Human title, also drives slug. |
| `slug` | **MVP** | Unique, stable, readable; SEO-critical (§22). |
| `reference_code` | **MVP** | Public-facing ID used in enquiries/adverts. **[OPEN DECISION 8.a]** format (e.g. `KP-0001`). |
| `listing_type` | **MVP** | `rent` \| `sale` (\| `short_let` if 2.d). |
| `property_type` | **MVP** | Controlled list. **[OPEN DECISION 8.b]** exact values (apartment, house, townhouse, studio, maisonette, bedsitter, commercial, land, …). |
| `status` | **MVP** | Lifecycle (§9). |
| `price` | **MVP** | `numeric`. Rent = per month; sale = total. **[OPEN DECISION 8.c]** show "Price on request"? |
| `currency` | **MVP** | Default `KES`; single currency only. Multi-currency = **Future**. |
| `price_period` | **Optional** | Derivable from `listing_type`; add only if rent periods vary (e.g. daily short-let). |
| `county` | **MVP** | Controlled list of Kenyan counties served. **[OPEN DECISION 6.a]** |
| `town` / city | **MVP** | |
| `area` / neighbourhood | **MVP** | Primary filter for seekers. |
| `estate` / building name | **Optional** | Useful, free-text, not filtered. |
| `address_line` | **Optional** | Often withheld publicly; store but consider not displaying exact address. |
| `latitude` / `longitude` | **Optional (store, don't display)** | Nullable; enables map view later (§ maps deferred). |
| `bedrooms` | **MVP** | Nullable (land/commercial). Filterable. |
| `bathrooms` | **MVP** | Nullable. `numeric` (allows 2.5). |
| `size_value` + `size_unit` | **Optional** | m² / acres; show when known; not a launch filter. |
| `parking` / `plinth` / `floors` | **Future** | Add per property type when needed. |
| `description` | **MVP** | Rich-ish text (plain or minimal markdown); never auto-generated filler. |
| `amenities` | **MVP** | `jsonb` array from a controlled vocabulary. **[OPEN DECISION 8.d]** amenity list. |
| `images` | **MVP** | `property_media` rows; cover + ordered gallery. |
| `videos` | **Future** | Store URL only; no hosting/transcoding. |
| `virtual_tour` | **Future** | External URL field. |
| `featured` | **MVP** | Boolean; drives Home + top of list. Admin-controlled. |
| `verified` | **MVP** | Boolean; trust badge. Admin-controlled (§14). |
| `agent_id` | **MVP** | FK → `profiles`; the staff member responsible / shown as contact. |
| `owner` reference | **Future** | No owner entity in MVP (§10). |
| `available_from` | **Optional** | `date` nullable; nice for rentals. |
| `published_at` | **MVP** | Set when first published; drives sort + sitemap. |
| `created_by` / `created_at` / `updated_at` | **MVP** | Audit basics. |
| `views` / analytics counters | **Future** | Use a proper analytics tool, not DB counters. |

**No final SQL is written in Phase 0.** `docs/database.md` remains the design contract; §28 lists the deltas this model implies.

---

## 9. Property Lifecycle

**[RECOMMENDED] MVP states:**

```
draft  ──▶  published  ──▶  unavailable  ──▶  archived
                 ▲               │
                 └───────────────┘   (relist)
             published  ──▶  let_or_sold  ──▶  archived
```

| State | Meaning | Public visibility | Who can set it |
|---|---|---|---|
| `draft` | Being prepared; incomplete. | Hidden | agent, admin |
| `published` | Live and available. | Visible | agent, admin |
| `unavailable` | Temporarily off-market (e.g. under offer, owner paused). | Hidden (or "coming back" — **[OPEN DECISION 9.a]**) | agent, admin |
| `let_or_sold` | Deal closed. | Hidden; retained for records/SEO history | agent, admin |
| `archived` | Retired from the catalogue. | Hidden | admin (agent may request) |

**Not included:** a separate `pending_review` / approval gate. Rationale: MVP has no external submitters (§10) and a 2-role staff model (§14); an approval queue adds process with no submitter to gate. **[RECOMMENDED — revisit if owner submissions are added.]**
**[OPEN DECISION 9.b]** Do agency workflows need an explicit "under offer" state distinct from `unavailable`?

See **ADR-006** consideration is folded into ADR for viewing/lifecycle if needed.

---

## 10. Property Ownership & Agency Relationship

**Reality:** K Pearl will list properties belonging to external landlords/owners as well as any it controls directly — i.e. Option C. **[ASSUMPTION — implied by "landlord representation" service]**

**MVP modelling decision: Option A shape.** Every property is a **staff-created listing**. There is:
- **no `owners` table**,
- **no owner authentication or portal**,
- **no owner-submitted listings**.

"List your property" is a **lead-capture form** that creates an inquiry of type `owner_listing`; staff follow up and create the listing themselves. **[RECOMMENDED — ADR-004]**

Rationale: an owner entity only earns its place when staff need to track owner contact details, commission terms, and multiple properties per owner as structured data. That is a CRM feature, not a launch feature. Adding it later is a clean additive migration (`owners` table + nullable `properties.owner_id`).

**[OPEN DECISION 10.a]** Do staff need owner contact details stored against each property from day one (even as free-text internal fields)? If yes, add nullable internal `owner_contact` text fields to `properties` — still no portal.

---

## 11. Property Discovery Experience (search & filters)

**Engine:** PostgreSQL only. No external search service. `ilike` / `websearch_to_tsquery` full-text over `title`, `area`, `town`, `description` is sufficient at catalogue sizes a startup agency will have for years. **[RECOMMENDED — `CLAUDE.md` §2 "keep it simple"]**

| Capability | MVP? | Notes |
|---|---|---|
| Keyword search | **MUST** (basic `ilike`); **SHOULD** upgrade to Postgres FTS | |
| Listing type (rent/sale) | **MUST** | Primary split. |
| Property type | **MUST** | From controlled list. |
| Location — county | **MUST** | Dropdown from served list. |
| Location — area/town | **MUST** | Dropdown or type-ahead over known values. |
| Price min / max | **MUST** | Range; sensible presets per listing type. |
| Bedrooms (min) | **MUST** | `1+`, `2+`, … |
| Bathrooms (min) | **SHOULD** | |
| Amenities multi-select | **COULD** | `jsonb` containment; add if users ask. |
| Availability / `available_from` | **COULD** | |
| Featured filter | **COULD** | Featured surfaced on Home regardless. |
| Verified-only toggle | **SHOULD** | Cheap trust filter. |
| Sort: newest / price ↑ / price ↓ | **MUST** | Default: featured first, then newest. |
| Pagination | **MUST** | Offset/limit, ~12/page; "load more" or numbered — **[OPEN DECISION 11.a]**. |
| URL-synced filters | **MUST** | Filters are shareable state → live in the query string. **[CONFIRMED — `docs/coding-standards.md`]** |
| Mobile filter sheet | **MUST** | Full-screen drawer on small screens. |
| Map-based search | **[FUTURE]** | Deferred with the rest of maps. |
| Saved searches / alerts | **[FUTURE]** | Needs accounts. |

---

## 12. Property Detail Experience

**Recommended hierarchy (mobile-first, single column):**

1. **Image gallery** — swipeable; cover first; tap to fullscreen; lazy-loaded; `alt` text per image.
2. **Title + reference code + verified/featured badges.**
3. **Price** (with period/context) and **listing type**.
4. **Location** — area, town, county (exact address optionally withheld — see 8).
5. **Key facts row** — bedrooms, bathrooms, size, property type, availability.
6. **Description.**
7. **Amenities** — iconless or simple list, grouped.
8. **Availability / status.**
9. **Agency / assigned agent block** — name/role + agency contact (no invented personal data; agent name only if the profile has one).
10. **Primary CTAs** — *Enquire about this property*, *Request a viewing*.
11. **Quick contact** — tap-to-call, tap-to-WhatsApp (prefilled with reference code), email.
12. **Structured data** (`JSON-LD`) and share metadata (not visible).
13. **Related/similar properties** — **SHOULD**, same area or type, 3–4 cards.

**Improvements over a generic layout:** reference code visible and pre-filled into every contact channel; verified badge near the title where trust is decided; withhold exact address by default to protect owners; similar-properties strip to keep a rejected lead on-site.

---

## 13. Customer Enquiry Workflow

**Public form — property enquiry**

| Field | Required | Notes |
|---|---|---|
| Name | Yes | |
| Phone | Yes | Kenyan format validation (`+254` / `07x` / `01x`), lenient. |
| Email | No (if phone given) | Validated if present. **[CONFIRMED — `docs/requirements.md` FR-05]** |
| Message | Yes | Min length; plain text. |
| Preferred contact method | Yes | phone \| whatsapp \| email. |
| Property reference | Auto | From the page; not user-editable. |
| Consent checkbox | **SHOULD** | Privacy acknowledgement — see §22 / legal. |
| Honeypot + timing | Yes (hidden) | Anti-spam (§22). |

**Internal lifecycle (recommended, minimal):**

```
new ──▶ contacted ──▶ in_progress ──▶ closed
```

- `closed` optionally carries an outcome note (won / lost / not proceeding) as free text or a small enum — **[OPEN DECISION 13.a]**.
- `assigned_to` — nullable FK → `profiles`. Any staff can assign; default unassigned.
- `internal_notes` — staff-only free text; **must never be exposed to public queries** (§22, §28).
- No SLA timers, no automated emails to the customer in MVP. **[RECOMMENDED]**

**General contact form** and **owner "list your property"** use the same table with a `type` discriminator (`property_enquiry` \| `general` \| `owner_listing`), `property_id` nullable.

---

## 14. Viewing Request Workflow

**Deliberately not a calendar.** **[CONFIRMED — `CLAUDE.md` §3, `docs/requirements.md` FR-06]**

MVP captures a request; staff coordinate by phone/WhatsApp.

| Field | Required |
|---|---|
| Property reference | Auto (required — viewing is always property-bound) |
| Name | Yes |
| Phone | Yes |
| Email | No |
| Preferred date | No (`date`) |
| Preferred time (text or coarse slot: morning/afternoon/evening) | No |
| Message | No |
| Anti-spam honeypot | Yes |

Lifecycle: `new ──▶ scheduled ──▶ completed ──▶ cancelled` (`scheduled` just records that staff arranged it; the arrangement itself lives outside the system). **[RECOMMENDED]**

**Recommendation on structure:** keep `viewing_requests` as its **own table** (distinct required fields, distinct lifecycle, distinct staff view) rather than folding into `inquiries`. **[RECOMMENDED]**

**Calendar / scheduling / reminders / sync:** **[FUTURE]** — only if lead volume makes manual coordination painful. See ADR-006.

---

## 15. Contact Strategy

Channels offered:

| Channel | Mechanism | MVP |
|---|---|---|
| Phone | `tel:` link, tap-to-call, shown in header/footer/detail | MUST |
| WhatsApp | `https://wa.me/<number>?text=<prefilled incl. reference code>` | MUST |
| Email | `mailto:` + contact form → `inquiries` | MUST |
| Property enquiry form | §13 | MUST |
| Viewing request form | §14 | MUST |
| General contact form | §13 (`type=general`) | MUST |
| "List your property" form | §10 (`type=owner_listing`) | SHOULD (page); MUST (capability) |
| Social media links | Footer icons | SHOULD |
| Live chat / chatbot | — | FUTURE |

**All real values are placeholders** wired via app config / `site_settings`:
**[OPEN DECISION 15.a]** official phone number(s).
**[OPEN DECISION 15.b]** WhatsApp business number.
**[OPEN DECISION 15.c]** official email address(es) (general + owner + careers?).
**[OPEN DECISION 15.d]** physical office address — show one, or "by appointment"?
**[OPEN DECISION 15.e]** which social platforms and handles.
**[OPEN DECISION 15.f]** business hours / expected response time to display.

---

## 16. Public Information Architecture

| Page | Route | Verdict | Notes |
|---|---|---|---|
| Home | `/` | **MVP** | §17. |
| Properties (list + search) | `/properties` | **MVP** | §11. |
| Property detail | `/properties/:slug` | **MVP** | §12. |
| Services | `/services` | **MVP** | Single page, anchored sections (§7). |
| About | `/about` | **MVP** | Brand story, mission, tagline; no invented history/stats. |
| Contact | `/contact` | **MVP** | Channels + general form + map/address block. |
| List Your Property | `/list-your-property` | **MVP (form) / SHOULD (dedicated page)** | May start as a section of Services/Contact. |
| Privacy Policy | `/privacy` | **MVP** | Legal — required before collecting personal data. |
| Terms of Use | `/terms` | **MVP** | Legal. |
| Areas We Serve | `/areas` | **Phase 2** | Needs confirmed area list + copy; good SEO surface later. |
| Property Valuation | `/valuation` | **Phase 2** | Service + intake form once process defined. |
| FAQs | `/faqs` | **Phase 2** | |
| Agents / Team | `/team` | **Phase 2** | Only with real, approved profiles. |
| Testimonials | `/testimonials` or Home section | **Phase 2** | Only with real, consented testimonials — never invented. |
| Blog / Insights | `/insights` | **Not MVP** | Implies a CMS/editor role; defer (§18). |
| 404 / error | — | **MVP** | Branded. |

**[OPEN DECISION 16.a]** Legal pages: will K Pearl supply reviewed Privacy/Terms copy, or does the project need a drafting task (and is Kenya Data Protection Act 2019 registration relevant)?

---

## 17. Homepage Structure

**Recommended sections (in order), tuned for a marketing-led sales+rental agency:**

1. **Hero** — one-line value proposition + tagline, brand imagery on a dark surface, and an inline **property search** (listing-type toggle, location, price). Primary CTA: *View Properties*. Secondary: *Contact K Pearl*.
2. **Featured properties** — 4–8 admin-selected listings as cards.
3. **Services overview** — 3–4 cards (Buy, Rent, Sell/Market, + one) linking into `/services`.
4. **Why K Pearl** — 3–4 trust points. Generic and honest until the owner supplies specifics; **no fabricated numbers**.
5. **Latest listings** — 6 most recently published, or a single *Browse all properties* band. **[OPEN DECISION 17.a]** keep both Featured and Latest, or just Featured?
6. **Owner CTA band** — "Have a property to let or sell? List it with K Pearl." → `/list-your-property`.
7. **Contact CTA** — call / WhatsApp / enquire, on a dark surface.
8. **Footer** — nav, contact, social, legal links, copyright.

**Deliberately excluded from the MVP homepage:** testimonials (no real content yet), "How it works" (compressed into Services), areas grid (Phase 2), blog teasers (no blog).

---

## 18. Staff Experience

### 18.1 Dashboard
Read-only overview: total properties, published, draft, `unavailable`, new inquiries (count), new viewing requests (count), and a **recent leads** list (last ~10, newest first) linking to detail. No charts in MVP. **[RECOMMENDED]**

### 18.2 Property management
List with filters (status, listing type, type, area, assigned agent) + search. Actions: create, edit, save as draft, publish, unpublish → `unavailable`, mark `let_or_sold`, archive, toggle **featured**, toggle **verified** (permission-gated — §19), manage media (upload, reorder, set cover, edit alt text, delete).

### 18.3 Inquiries
List + filters (status, type, assigned, has-property). View one; change status; assign to a staff member; add/edit internal notes. No bulk actions in MVP.

### 18.4 Viewing requests
List + filters (status, date). View one; change status; add internal notes.

### 18.5 Content management
MVP: **none.** Services copy, About copy, Why-K-Pearl points, and homepage text live in code and change via deploy. **[RECOMMENDED — `CLAUDE.md` §14: no CMS without a real need.]**
**SHOULD-HAVE:** a single-row **`site_settings`** record for **contact details and social links** so non-developers can update phone/WhatsApp/email/hours without a deploy.
**[FUTURE]:** editable Services/FAQ/Areas/Testimonials/Blog → introduces an `editor` role and CMS tables.

---

## 19. Roles & Permissions

**MVP role model: two roles.** `admin`, `agent`. **Drop `editor`** until there is content to edit (§18.5). **[RECOMMENDED — ADR-007]**

| Capability | `agent` | `admin` |
|---|---|---|
| Sign in to `/staff` | ✅ | ✅ |
| View dashboard | ✅ | ✅ |
| View all properties | ✅ | ✅ |
| Create property | ✅ | ✅ |
| Edit any property | ✅ (**[OPEN DECISION 19.a]** any, or only assigned?) | ✅ |
| Draft / publish / unpublish / mark let-or-sold | ✅ | ✅ |
| Archive property | request → ✅ **[OPEN DECISION 19.b]** | ✅ |
| Toggle **featured** | ❌ (propose) | ✅ |
| Toggle **verified** | ❌ | ✅ |
| Manage property media | ✅ | ✅ |
| View / progress inquiries & viewing requests | ✅ (all) | ✅ |
| Assign leads | ✅ | ✅ |
| Edit `site_settings` | ❌ | ✅ |
| Manage staff accounts / roles | ❌ | ✅ |
| Delete (hard) anything | ❌ | ❌ (archive only; hard delete via DB console) |

Rationale for admin-only `featured`/`verified`: both are **trust and merchandising signals**; concentrating them keeps them meaningful.

All of the above **must be enforced by RLS policies keyed on the caller's role** (from `profiles.role`), not merely by hiding buttons. **[CONFIRMED — `CLAUDE.md` §7]**

**[OPEN DECISION 19.c]** How are staff onboarded — admin creates the auth user + profile, or Supabase invite email? (Recommend: admin-triggered invite; **no public staff signup**.)

---

## 20. Supabase Responsibilities

### PostgreSQL
`profiles`, `properties`, `property_media`, `inquiries`, `viewing_requests`, and (SHOULD) `site_settings`. Details in §28.

### Auth
- **Staff only** in MVP: email + password, password reset. No magic links, no social login, **no public signup UI**.
- Public/customer accounts: **[FUTURE]** (§21, ADR-005).

### Storage
- One bucket: **`property-media`** — public read, authenticated-staff write, with type/size limits enforced by policy (§22).
- Branding assets ship in the app bundle (`frontend/public/assets/branding/`), not Storage. **[CONFIRMED — asset already there]**
- Documents bucket (contracts, owner docs): **[FUTURE]**.

### Realtime
- **Not used in MVP.** Dashboard counts load on navigation. **[RECOMMENDED — `CLAUDE.md` §10 "avoid unnecessary realtime".]** (Rental Hunt uses Realtime for notifications; K Pearl drops it.)

### Edge Functions
- **Zero required.** One **SHOULD-HAVE** candidate: `notify-lead` — on new `inquiries` / `viewing_requests` row, send an email to the agency inbox via a transactional email provider (API key = server-side secret, hence a function). Trigger via database webhook or called from the repository after insert. **[RECOMMENDED as SHOULD-HAVE]**
- **[OPEN DECISION 20.a]** transactional email provider (e.g. Resend / Postmark / SES) and sending domain.
- No function may merely proxy a public read query. **[CONFIRMED — `CLAUDE.md` §2.]**

---

## 21. Authentication Strategy

**MVP:** Supabase Auth, **staff only**.
- Email + password.
- Password reset via email.
- Session handling via Supabase client; `/staff/**` guarded by an auth boundary component **and** RLS.
- Staff accounts provisioned by an admin (invite or manual). No self-service registration.
- No magic links, no MFA in MVP (**[OPEN DECISION 21.a]** — is MFA required for staff by the business?).

**Future:** optional public accounts to unlock favorites, saved searches, and email alerts — additive, behind its own auth flow, gated by ADR-005.

**Recommendation:** keep the auth surface as small as possible; every added method is an added attack and support surface.

---

## 22. Security Requirements

Must be implemented and verified **before production**:

| Area | Requirement |
|---|---|
| RLS | Enabled on **every** table. Public: `SELECT` only `properties` where `status='published'` and only `property_media` for such properties. Public `INSERT` on `inquiries`/`viewing_requests` restricted to the minimal column set. No public `UPDATE`/`DELETE`. Staff/admin policies keyed on `profiles.role`. **[CONFIRMED — `CLAUDE.md` §7]** |
| Internal notes confidentiality | `inquiries.internal_notes` and any staff-only fields must be unreachable by anon/public roles. Row-level policies don't restrict columns — use a **public-safe view** or a **separate `inquiry_notes` table** with its own policy. **Decide in DB design.** **[RECOMMENDED — flag for `docs/database.md`]** |
| Service-role key | Never in the browser or the repo. Only in Edge Function / server env. **[CONFIRMED]** |
| Input validation | Every write validated with **Zod** in the service layer; DB `CHECK`/`NOT NULL`/enum constraints as backstop. **[CONFIRMED — `CLAUDE.md` §6]** |
| Spam / abuse | Honeypot field + minimum submit-time on all public forms (MUST). Per-IP / per-phone rate limiting on inserts (SHOULD — via Edge Function or Postgres). Cloudflare Turnstile or hCaptcha **[SHOULD, add if spam becomes material]**. |
| Upload restrictions | Storage policy: images only (`image/jpeg|png|webp|avif`), max size (**[OPEN DECISION 22.a]**, e.g. 8 MB), staff-authenticated writes only. Consider server-side/derived resizing. |
| Phone/email validation | Format-validate; do not claim verification. |
| Auditability | `created_by`, `created_at`, `updated_at` on mutable tables. Full audit log = **[FUTURE]**. |
| Error messages | User-facing errors sanitised; raw DB errors normalised in repositories to typed app errors. **[CONFIRMED — `docs/api-design.md`]** |
| Secrets | None committed. `.env` git-ignored (already is). **[CONFIRMED — `.gitignore`]** |
| Data protection law | **[OPEN DECISION 16.a / 22.b]** Kenya Data Protection Act 2019 obligations (privacy notice, lawful basis, data-subject requests, possible registration). |
| Auth redirect URLs | Configure allowed redirect/callback URLs per environment before launch. |

---

## 23. SEO Requirements

Stay a **Vite SPA**. Do **not** adopt SSR in MVP. **[CONFIRMED — `CLAUDE.md` / `docs/architecture.md` §6]**

| Item | MVP | Notes |
|---|---|---|
| Readable, stable property slugs | **MUST** | e.g. `/properties/3-bed-apartment-kilimani-kp-0123`. Slug immutable once published; changes → 301. |
| Per-route `<title>` + meta description | **MUST** | Via a head manager (e.g. `react-helmet-async` or equivalent). |
| Open Graph + Twitter card tags | **MUST** | Property cover as `og:image`. |
| Canonical URLs | **MUST** | One canonical per property; strip filter params on canonical for list pages. |
| `robots.txt` | **MUST** | Allow public; disallow `/staff`. |
| `sitemap.xml` | **MUST** | Generated at build (static pages) + dynamically for published properties (**[OPEN DECISION 23.a]** build-time regeneration vs. an Edge Function endpoint). |
| Structured data (JSON-LD) | **MUST** on detail | `schema.org` `Residence`/`Apartment` + `RealEstateListing`/`Offer`; `Organization` on Home. |
| Image `alt` text | **MUST** | Authored per media row in admin. |
| Semantic HTML + headings | **MUST** | One `h1` per page; landmark elements. |
| Performance budget | **MUST** | Lighthouse Perf ≥ 90, A11y ≥ 95 (`CLAUDE.md` §10). Responsive images (`srcset`), lazy gallery, no full-res in cards. |
| Pre-rendering / static generation | **SHOULD** | If Google indexes SPA content poorly, add build-time prerender for static routes and/or property pages (e.g. `vite-plugin-ssg` / prerender) **without** moving off Vite. Evaluate post-launch with Search Console. See ADR note in §29. |
| Location landing pages | **[FUTURE / Phase 2]** | `/areas/:area` — strong long-tail SEO once the area list is confirmed. |

---

## 24. Mobile Experience

Mobile-first is non-negotiable. **[CONFIRMED — `CLAUDE.md` §8]**

| Interaction | Mobile design |
|---|---|
| Navigation | Logo + hamburger → full-screen drawer; persistent tap-to-call / WhatsApp affordance. |
| Property search | Compact inline search in hero; full filters open in a bottom sheet / full-screen modal; "Apply" + "Clear"; result count live. |
| Property cards | Single column; large cover image; price and key facts legible without zoom; whole card tappable. |
| Gallery | Swipeable carousel; pinch/tap to fullscreen; lazy-loaded; fixed aspect ratio to avoid layout shift. |
| Enquiry / viewing forms | Single column; correct input `type`/`inputmode` (`tel`, `email`); large touch targets; inline validation; visible success state. |
| Call / WhatsApp | `tel:` and `wa.me` deep links; WhatsApp text prefilled with the property reference code. |
| Staff dashboard | Usable on phone (agents in the field): stacked cards, tables scroll horizontally in a contained region; media upload from camera roll. |

**Desktop-specific (progressive enhancement, not required for launch):** multi-column property grid, side-by-side filters, larger gallery with thumbnails, hover states.

---

## 25. Branding & UI Direction

### 25.1 What the supplied asset tells us **[CONFIRMED — `frontend/public/assets/branding/k-pearl-logo.png`]**
- Square raster, **gold-on-black**. Elements: gold serif wordmark "K.pearl", spaced-capitals "AGENCY", tagline "MARKETING REAL ESTATE, CREATING VALUE", a **black pearl in an open shell**, gold **skyline + house-roof** line art, a gold **circular arc** and a gold **swoosh/wave**.
- Aesthetic: premium, elegant, high-contrast, restrained. Serif-led. Metallic gold as precious accent, not fill.

### 25.2 Colour token strategy **[RECOMMENDED — exact hex values OPEN]**
| Token | Role | Direction |
|---|---|---|
| `--color-ink` | near-black base / dark surfaces | very dark neutral, not pure `#000` |
| `--color-surface` | primary light content surface | warm ivory / off-white |
| `--color-gold` | primary accent — CTAs, price, badges, active states | warm metallic gold |
| `--color-gold-deep` | gold hover/pressed | darker gold |
| `--color-charcoal` | secondary text, dark cards on light | |
| `--color-muted` | tertiary text, meta | muted grey |
| `--color-line` | hairline borders | low-contrast neutral |
| semantic: `success` / `warning` / `danger` / `info` | forms, admin | conservative, accessible |

Rules: gold is an **accent only** — never a page background; avoid gradients, glow, heavy shadows; dark surfaces for hero + footer + contact bands, light surface for reading. **[CONFIRMED — `CLAUDE.md` §8, `docs/branding.md`]**

### 25.3 Typography **[RECOMMENDED — typefaces OPEN]**
- **Display / headings:** a refined serif echoing the wordmark.
- **Body / UI / forms:** a clean, highly legible sans (or system stack).
- Self-hosted and subset; counts against the performance budget. Clear type scale; one `h1` per page.
- **[OPEN DECISION 25.a]** chosen typefaces (licensing for web use confirmed).

### 25.4 Components
- **Buttons:** primary = solid gold with ink text (or ink with gold text on dark); small radius (~2–4px); generous padding; secondary = outline; tertiary = text link with letter-spacing echoing "AGENCY". Visible focus ring (accessibility).
- **Cards:** light surface, 1px `--color-line` border, soft shadow, image-forward (fixed 4:3 or 16:9 cover), gold reserved for price/badge/CTA.
- **Badges:** `Featured`, `Verified` — icon + label (never colour alone — accessibility).
- **Forms:** labelled, generous spacing, inline validation, explicit loading/empty/error/success states. **[CONFIRMED — `docs/architecture.md` §7]**

### 25.5 Imagery
Property photography is the main visual element. Enforce aspect ratios, responsive `srcset`, lazy-load, blur/skeleton placeholder. Never load gallery-resolution images in cards. **[CONFIRMED — `CLAUDE.md` §10]**

### 25.6 Logo usage
- Use the supplied logo **as-is**; do not recolour or reconstruct in CSS. **[CONFIRMED — `docs/branding.md`]**
- Dark hero can host it directly.
- **[OPEN DECISION 25.b]** The only supplied file is a gold-on-black **raster square**. Request from the owner: (i) a **transparent-background** version, (ii) an **SVG / vector** master, (iii) a **horizontal lockup** for the site header, (iv) a **standalone pearl-in-shell mark** for favicon / social / app icons, (v) a **light-surface-safe** variant.
- **[CONFIRMED]** Do not invent a different tagline. The tagline is "MARKETING REAL ESTATE, CREATING VALUE".

---

## 26. Rental Hunt Comparison

Rental Hunt KE = tenant-facing rental discovery platform; React 19 / TS / Vite / Tailwind v4 / Radix UI / Supabase / Leaflet / TanStack Query / RHF+Zod / Vitest / Sentry; "documentation-driven"; ~9/11 sprints, pre-launch. **[CONFIRMED — reference repo README]**

| Area | Rental Hunt | K Pearl (recommended) | Decision / why |
|---|---|---|---|
| Business model | Rental discovery marketplace, tenant↔agent | Agency shopfront + lead-gen, sales **and** rental | K Pearl is one agency marketing its own mandates, not a multi-agent marketplace. |
| Property catalogue | Rentals, tenant-oriented | Rentals + sales, staff-managed | Tagline is "marketing real estate"; sales adds ~1 enum. |
| Search | Keyword + filters | Keyword + filters, PostgreSQL only | Same approach; keep it DB-side. |
| Filters | Rental-centric | + listing type, + verified-only; amenities = COULD | Sales/rental split is the key addition. |
| Authentication | Public users + agents | **Staff only** in MVP | No public membership at launch. |
| User accounts | Yes (tenants) | **No** (MVP) | Favorites/alerts don't justify accounts yet — ADR-005. |
| Favorites | Yes (account-based) | **COULD**, `localStorage` only, no account | Give the feel without the auth surface. |
| Enquiries | Tenant→agent messaging | Property enquiry + general + owner lead, one table + `type` | Consolidate lead intake; staff-side status/assign/notes. |
| Viewing / booking | Not documented | Capture-only request, no calendar | Explicitly no scheduler — `CLAUDE.md` §3. |
| Admin | Agent-oriented | Two-role staff admin (`admin`,`agent`) | Smaller org; `editor` deferred with CMS. |
| Payments | None | **None** (permanently out of MVP) | Not the product. |
| Property owners | Not a first-class entity | Lead form only; no entity/portal in MVP | Additive later — ADR-004. |
| Agents | Multiple agents as users | Staff = `profiles`; assigned agent per property/lead; public agent pages Phase 2 | No separate agents table. |
| Content / CMS | Docs-driven, mostly static | Static copy in code; `site_settings` for contact info only | No CMS without a real need — `CLAUDE.md` §14. |
| Maps | Leaflet integrated | **Deferred**; store lat/long, no map UI in MVP | Avoid dependency + perf cost until needed. |
| Notifications | Supabase Realtime | No realtime; email-to-agency on new lead = SHOULD (1 Edge Fn) | `CLAUDE.md` §10 — avoid unnecessary realtime. |
| Monitoring | Sentry | **[OPEN DECISION 26.a]** add Sentry or lighter alternative | Recommend error monitoring before launch. |
| UI kit | Radix UI | **[OPEN DECISION 26.b]** Radix/Headless UI for a11y primitives vs. hand-built | Recommend a headless primitive lib for accessible mod/menu/dialog. |

**Retain from Rental Hunt:** stack, layering discipline, documentation-driven workflow, RLS-as-authorization, Zod-validated writes, testing posture.
**Change:** product model (agency vs marketplace), auth scope (staff-only), catalogue scope (+sales).
**Remove for MVP:** public accounts, favorites-with-auth, maps, realtime notifications.
**Add:** sales listings, verified/featured merchandising, owner lead capture, Services content model, premium black/gold brand system.

---

## 27. MVP Scope (MoSCoW)

### MUST HAVE — required to launch
- Public pages: Home, Properties (list + search + core filters + sort + pagination), Property detail (gallery, facts, description, amenities, CTAs), Services, About, Contact, Privacy, Terms, branded 404.
- Property enquiry form, viewing request form, general contact form — all writing to Supabase with Zod validation + honeypot.
- Contact affordances: tap-to-call, tap-to-WhatsApp (prefilled), email — driven by config placeholders.
- Staff auth (email/password + reset), `/staff` route guard.
- Staff dashboard with counts + recent leads.
- Property CRUD + lifecycle (`draft`→`published`→`unavailable`/`let_or_sold`→`archived`) + media management (upload, reorder, cover, alt text, delete) + featured/verified toggles (admin-gated).
- Inquiry + viewing-request management: status, assignment, internal notes (notes never public).
- RLS on every table; storage bucket with staff-write/public-read + type/size limits.
- SEO baseline: slugs, per-route meta, OG, canonical, `robots.txt`, `sitemap.xml`, JSON-LD on detail, image alt text.
- Mobile-first responsive; accessibility baseline (semantic HTML, keyboard, focus states, contrast, no colour-only meaning).
- Brand system: black/gold tokens, typography, core components.
- **Phase 1 foundation** (see §30): pinned dependencies + committed lockfile + `tsconfig`/`vite`/`tailwind`/`eslint`/`vitest` configs + app shell + green CI.

### SHOULD HAVE — soon after launch
- `notify-lead` Edge Function → email to agency inbox on new lead.
- Dedicated **List Your Property** page.
- `site_settings` single-row table for editable contact/social info.
- Postgres full-text search (upgrade from `ilike`).
- Verified-only filter; bathrooms filter.
- Related/similar properties on detail pages.
- Pre-render/static generation for SEO if Search Console shows weak indexing.
- Error monitoring (Sentry or equivalent).
- Areas We Serve page (once area list confirmed).

### COULD HAVE — nice to have
- Favorites via `localStorage` (no account).
- Property valuation request page.
- FAQs page.
- Share buttons on detail pages.
- Testimonials section — **only** with real, consented content.
- Agent/team profile pages — **only** with real, approved content.

### NOT MVP — explicitly excluded
Public/customer accounts & auth · owner portal / owner entity / owner-managed listings · payments, rent collection, leases, tenant portal · calendar/appointment scheduling & reminders/sync · maps / Leaflet map view · realtime notifications · blog / CMS / articles / editor role · reviews, ratings, any public UGC · saved searches & email alerts · multi-currency · native mobile app · AI property matching/recommendations.
**[CONFIRMED — consistent with `CLAUDE.md` §3 and `docs/requirements.md` "Deliberately out of MVP".]**

---

## 28. Database Implications

**No SQL is written in Phase 0.** `docs/database.md` stays the design contract. The following are the **deltas** the recommended product model implies, for review.

### Tables to keep (as designed, with edits below)
`profiles`, `properties`, `property_media`, `inquiries`, `viewing_requests`.

### Table to add
- **`site_settings`** — single-row (enforced by a `CHECK` on a constant PK or a unique singleton pattern): contact phone, WhatsApp number, email(s), office address, business hours, social links. **SHOULD-HAVE.** Public `SELECT`; admin `UPDATE` only.

### `profiles` — edits
- `role` constrained to **`admin` | `agent`** for MVP (drop `editor`). Enum or `CHECK`.
- Keep `full_name`, `phone`, timestamps.

### `properties` — edits
- Add **`listing_type`** — `CHECK IN ('rent','sale')` (+ `'short_let'` iff OPEN 2.d).
- `property_type` — constrained to the confirmed controlled list (OPEN 8.b).
- **`status`** — align to the §9 lifecycle: `draft | published | unavailable | let_or_sold | archived`.
- Add **`agent_id uuid` → `profiles(id)`** (assigned/contact agent), nullable, `ON DELETE SET NULL`.
- Add **`available_from date` null** (optional).
- Keep `latitude`/`longitude` nullable (stored, not shown in MVP).
- Confirm **`reference_code`** generation rule + format (OPEN 8.a) — likely a sequence + prefix; `UNIQUE`.
- Confirm **`slug`** immutability policy + uniqueness.
- `amenities jsonb` — validated against the controlled vocabulary in the service layer (OPEN 8.d).
- Optional: nullable free-text `owner_contact_*` internal fields (OPEN 10.a) — **staff-only exposure**.

### `inquiries` — edits
- Add **`type`** — `CHECK IN ('property_enquiry','general','owner_listing')`.
- `property_id` nullable (null for `general`/`owner_listing`).
- Add **`assigned_to uuid` → `profiles(id)`** nullable, `ON DELETE SET NULL`.
- **`status`** — `new | contacted | in_progress | closed` (+ optional outcome, OPEN 13.a).
- **`internal_notes`** — must be **column-confidential**: implement via a **public-safe view** for anon reads, or move notes to a separate **`inquiry_notes`** table with its own RLS. Decide in `docs/database.md`.
- `preferred_contact_method` — `CHECK IN ('phone','whatsapp','email')`.

### `viewing_requests` — edits
- Keep as its own table. `status` → `new | scheduled | completed | cancelled`.
- `preferred_time` — free text or coarse enum (`morning|afternoon|evening`) — OPEN.
- Same internal-notes confidentiality consideration if notes are added.

### Tables explicitly **not** added in MVP
`owners`, `favorites`, `saved_searches`, `agents` (agents = `profiles`), `services` / `pages` / `articles` / `faqs` / `areas` / `testimonials` (CMS), `audit_log`.

### Indexes likely required
- `properties (status, published_at DESC)` — public list default.
- `properties (listing_type, property_type)`.
- `properties (county, area)`.
- `properties (price)`.
- `properties (featured) WHERE status='published'` (partial) — Home.
- `UNIQUE (slug)`, `UNIQUE (reference_code)`.
- FTS: `GIN` index on a `tsvector` over title/area/town/description (SHOULD-HAVE phase).
- `property_media (property_id, sort_order)`.
- `inquiries (status, created_at DESC)`, `inquiries (type)`, `inquiries (property_id)`, `inquiries (assigned_to)`.
- `viewing_requests (status, created_at DESC)`, `viewing_requests (property_id)`.

### Relationships
- `property_media.property_id → properties.id` `ON DELETE CASCADE`.
- `properties.created_by`, `properties.agent_id`, `inquiries.assigned_to` → `profiles.id` (`SET NULL`).
- `inquiries.property_id`, `viewing_requests.property_id → properties.id` (`SET NULL` / `RESTRICT` — **[OPEN DECISION 28.a]**: keep leads if a property is deleted → `SET NULL`; but MVP archives rather than deletes, so either is safe).

### RLS implications (summary; full policies in DB design)
- Anon: `SELECT` `properties` where `status='published'`; `SELECT` `property_media` joined to published properties; `SELECT` `site_settings`; `INSERT` `inquiries`/`viewing_requests` with a restricted column list and forced default `status`; **no** access to `internal_notes`, `assigned_to` write, or any other table.
- `agent`: full `SELECT` on catalogue + leads; `INSERT`/`UPDATE` on `properties` (per OPEN 19.a/b), `property_media`, lead `status`/`assigned_to`/notes.
- `admin`: all of `agent` + `featured`/`verified` writes + `site_settings` `UPDATE` + `profiles` management.

### Storage buckets
- **`property-media`** — public read; `INSERT`/`UPDATE`/`DELETE` for authenticated staff; MIME allowlist + size cap in policy.

> **Current proposal** above is **not** an approved schema. **Final schema requires business approval of the open decisions in §31, then a dedicated database-design pass updating `docs/database.md`, then migrations in Phase 2.**

---

## 29. Architecture Implications

**The planned architecture stands. No change is required for MVP.** **[RECOMMENDED]**

Confirmed to remain as-is:
- **React SPA on Vite** — adequate for MVP; SEO handled by meta management + JSON-LD + (SHOULD) build-time prerender, not SSR. **[CONFIRMED — `docs/architecture.md` §6]**
- **Supabase-only backend** — no Django, no Express. **[CONFIRMED — ADR-001]**
- **Repository → Service → Hook → Page layering**, no Supabase in components. **[CONFIRMED]**
- **RLS as the authorization boundary.** **[CONFIRMED]**
- **Public (`/`) vs staff (`/staff`) route trees** in one app. **[CONFIRMED]**
- **Edge Functions only when privileged** — one SHOULD-HAVE candidate (`notify-lead`). **[CONFIRMED direction]**

Proposed ADRs arising from Phase 0 (added to `docs/decisions.md` as **Proposed**):
- **ADR-002** — Agency-first product model (not a marketplace).
- **ADR-003** — Catalogue covers both rentals and sales.
- **ADR-004** — No external-owner entity or portal in MVP; owner interest captured as leads.
- **ADR-005** — No public user accounts / favorites-with-auth in MVP.
- **ADR-006** — Viewing requests are capture-only; no calendar/scheduler in MVP.
- **ADR-007** — Two-role staff model (`admin`, `agent`) for MVP; `editor` deferred with CMS.
- **ADR-008 (note only)** — Remain on Vite SPA; revisit prerender/SSG for SEO after launch based on Search Console data. Not a migration.

No irreversible decision is being made without a written record. **[CONFIRMED — `CLAUDE.md` §14]**

---

## 30. Technical Foundation Findings (for Phase 1 — do **not** fix in Phase 0)

Audit of the current scaffold. Each item blocks a clean `npm install && npm run typecheck && lint && test && build` and/or CI today.

| # | Finding | Evidence | Phase 1 action |
|---|---|---|---|
| T1 | **All dependencies pinned to `"latest"`** in both `package.json` files. | `package.json`, `frontend/package.json` | Replace every `"latest"` with explicit, compatible versions; commit a lockfile. Non-reproducible builds violate `docs/requirements.md`. |
| T2 | **No lockfile anywhere**, but CI runs `npm ci` with `cache-dependency-path: frontend/package-lock.json`. | `.github/workflows/ci.yml`, `PROJECT_MANIFEST.txt` | `npm install` once deps are pinned; commit `frontend/package-lock.json`. Until then **CI cannot pass**. |
| T3 | **No `tsconfig.json` / `tsconfig.node.json`** in `frontend/`. | dir listing; `build` script is `tsc -b && vite build` | Add strict TS config(s) per `CLAUDE.md` §6 (`strict`, `noUncheckedIndexedAccess`, no implicit `any`). `typecheck`/`build` fail without them. |
| T4 | **No `vite.config.ts`.** | dir listing | Add with `@vitejs/plugin-react`, path aliases, test config (or separate `vitest.config.ts`). |
| T5 | **No Tailwind v4 setup** — no CSS entrypoint with `@import "tailwindcss"`, no `@theme` tokens, no PostCSS/Vite plugin wired. | dir listing; `tailwindcss` in devDeps | Add Tailwind v4 CSS-first config + brand tokens (§25.2) + `styles/` per `docs/project-structure.md`. |
| T6 | **No ESLint config** (`eslint.config.js`), but `lint` script is `eslint .`. | `frontend/package.json` | Add flat-config ESLint (TS, React, hooks, jsx-a11y, import). `lint` fails without it. |
| T7 | **No Vitest setup / test dir** — no `src/test/setup.ts`, no `@testing-library/jest-dom` wiring; `test` script is `vitest run`. | dir listing | Add test setup, RTL config, jsdom env; wire in Vite/Vitest config. |
| T8 | **No `index.html`, no `src/main.tsx`, no `src/App.tsx`, no router.** `src/` has only README placeholders. | dir listing | Phase 1 app shell: entry, providers (Router, TanStack Query), layout, error boundary. |
| T9 | **Not a git repository** (`.git` absent), yet CI triggers on `push`/`pull_request` and `CLAUDE.md` §12 mandates branch/commit conventions. | `git status` fails; `.gitignore` present | Initialise git **when explicitly instructed** (Rule 4); create remote; then CI is meaningful. |
| T10 | **No `supabase/config.toml`** — Supabase CLI local dev not initialised; only README placeholders under `supabase/`. | dir listing | `supabase init` in Phase 2; keep migrations/seed under existing dirs. |
| T11 | **Root `package.json` uses `"supabase": "^2.0.0"` as a devDependency** and delegates scripts to `frontend/`. | `package.json` | Fine; pin exact version alongside T1; confirm the CLI-as-dependency approach is intended vs. global install. |
| T12 | **CI has no fallback if the lockfile is missing** and no `typecheck`→`lint`→`test`→`build` failure isolation. | `ci.yml` | After T2, optionally split steps / add `--if-present`; add Node cache correctness check. |
| T13 | **React resolves to v19 via `"latest"`** — matches `CLAUDE.md` intent, but unpinned. | `CLAUDE.md` §1 vs `frontend/package.json` | Pin React 19.x explicitly (T1). |
| T14 | **No Prettier / formatting config** though `CLAUDE.md` review checklist implies formatting. | dir listing | Add Prettier + `eslint-config-prettier`, or adopt Biome; decide in Phase 1. |
| T15 | **No `.nvmrc` / `engines`** — CI pins Node 20 but local dev is unconstrained. | `ci.yml` | Add `engines.node` / `.nvmrc` = 20. |
| T16 | **`.env.example` covers only** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`. | `.env.example` | Extend in Phase 1/2 with contact-info placeholders (if not using `site_settings`), email provider (server-side only), Sentry DSN, etc. Never add secrets to `VITE_`-prefixed vars. |

**Order for Phase 1:** git (on instruction) → pin deps + lockfile → TS/Vite/Tailwind/ESLint/Prettier/Vitest configs → app shell + brand tokens → confirm CI green → Supabase client wiring + env handling.

---

## 31. Open Decisions (consolidated — business-owner input required)

| ID | Decision needed |
|---|---|
| 2.a | Rentals only / sales only / both? |
| 2.b | Exact list + wording of agency services to present. |
| 2.c | Commercial property and/or land at launch, or residential only? |
| 2.d | Short-term/furnished lets in scope? |
| 6.a | Counties / towns / areas served at launch (the controlled location list). |
| 8.a | `reference_code` format (e.g. `KP-0001`). |
| 8.b | Controlled `property_type` values. |
| 8.c | Allow "Price on request"? |
| 8.d | Controlled amenities vocabulary. |
| 9.a | Are `unavailable` properties hidden entirely, or shown as "temporarily off-market"? |
| 9.b | Need an explicit "under offer" state? |
| 10.a | Store owner contact details against each property from day one (internal only)? |
| 11.a | Pagination style: numbered pages vs. "load more". |
| 13.a | Enquiry `closed` outcome — free text or small enum (won/lost/…)? |
| 15.a–f | Official phone(s), WhatsApp number, email(s), office address, social platforms/handles, business hours & response-time promise. |
| 16.a | Legal pages: owner supplies reviewed Privacy/Terms, or project drafts them? Kenya DPA 2019 obligations/registration? |
| 17.a | Homepage: keep both Featured and Latest sections, or Featured only? |
| 19.a | Can an `agent` edit **any** property or only ones assigned to them? |
| 19.b | Can an `agent` archive, or only request archival? |
| 19.c | Staff onboarding: admin-created vs. invite email. MFA for staff required? (also 21.a) |
| 20.a | Transactional email provider + sending domain (for `notify-lead`). |
| 22.a | Max upload size per image. |
| 22.b | Kenya Data Protection Act 2019 compliance scope. |
| 23.a | Sitemap generation: build-time regeneration vs. runtime endpoint. |
| 25.a | Chosen display + body typefaces (with web licence). |
| 25.b | Additional logo formats: transparent PNG, SVG/vector, horizontal lockup, standalone mark, light-surface variant. |
| 26.a | Error monitoring tool (Sentry or lighter). |
| 26.b | Accessible-component primitive library (Radix/Headless UI) vs. hand-built. |
| 28.a | FK delete behaviour for leads when a property is removed. |
| G.1 | Hosting target for the frontend (Vercel is a `docs/deployment.md` suggestion, not confirmed). |
| G.2 | Domain name(s) for the site. |
| G.3 | Supabase project ownership/organisation + environment plan (local/staging/prod). |
| G.4 | Analytics tool (privacy-respecting) — in MVP or later? |
| G.5 | Content: who writes About / Services / Why-K-Pearl copy, and property descriptions? |
| G.6 | Photography: source and rights for property and brand imagery. |

---

## 32. Recommendations

1. **Approve Model B** (sales + rental catalogue) with other services as content + lead capture. (ADR-002/003)
2. **No owner entity, no public accounts, no maps, no realtime, no scheduler in MVP.** (ADR-004/005/006) Keep the backend and the auth surface small.
3. **Two staff roles.** Admins own `featured`/`verified`/settings/staff; agents run the catalogue and leads. (ADR-007)
4. **One consolidated lead table** (`inquiries` + `type`) plus a separate `viewing_requests`; internal notes column-confidential by design.
5. **Stay on Vite.** Do SEO properly with meta + JSON-LD + sitemap now; evaluate build-time prerender after launch with real Search Console data. (ADR-008 note)
6. **Front-load the Phase 1 foundation fixes** (§30) — pinned deps + lockfile + configs + shell + green CI — before any feature work. This is the single biggest source of current friction.
7. **Get the missing brand assets** (§25.6 / 25.b) and the **served-areas list** (6.a) early — both block real UI and real content.
8. **Commission reviewed legal copy** (16.a) before any form goes live.
9. **Do not populate the site with invented facts.** Every number, claim, testimonial, and area name waits for the owner. Placeholders and empty states are acceptable for launch prep; fabrications are not.
10. **Resolve §31 open decisions in one working session** with the business owner, then run a dedicated database-design pass and update `docs/database.md` before Phase 2.

---

## 33. Approval Gate

This document is the Phase 0 output. It is **discovery, not authorisation**.

- [ ] Business owner has reviewed §2–§27 and confirmed the product direction.
- [ ] Open decisions in §31 are answered (or explicitly deferred with a named owner).
- [ ] Proposed ADR-002…ADR-007 are accepted / amended / rejected in `docs/decisions.md`.
- [ ] `docs/database.md` updated in a dedicated pass reflecting §28 + the resolved decisions.
- [ ] `docs/project-state.md` moved to "Phase 0 approved" **by a human**.

> **No application development — no React components, no `.ts`/`.tsx` implementation, no SQL, no migrations, no Supabase project, no dependency installation, no git initialisation — may begin until the human project owner reviews and approves this document and the resulting Phase 0 decisions.**

**After approval, the next step is Phase 1 (Repository foundation)** per `docs/roadmap.md`, beginning with the technical-foundation fixes in §30 — not feature code.
