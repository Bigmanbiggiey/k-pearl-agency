# K Pearl Agency — Database Readiness Check

> Version: 1.0
> Status: **SUPERSEDED (2026-08-27).** The questionnaire is answered, every open
> item below is resolved in `docs/phase-0-decision-register.md`, and the schema is
> finalised in `docs/database.md` v2.0 and implemented as migrations under
> `supabase/migrations/`. Kept for history.
> Purpose: assess how close `docs/database.md` is to a schema that can be turned
> into migrations, by cross-checking it against `docs/product-definition.md`.
> **No SQL and no migrations are produced here.** This is a readiness assessment only.

---

## Verdict

**NOT READY FOR PHASE 2 MIGRATIONS.**

The overall shape (five tables, UUID keys, RLS everywhere, explicit public
visibility) is sound and unchanged. However, several column-level and policy-level
details depend on business decisions that are still open
(`docs/phase-0-decision-register.md`). Those must be answered, and `docs/database.md`
reworked to reflect them, before any migration is written.

`docs/database.md` already carries a Phase 0 note pointing at
`docs/product-definition.md` §28; this document is the detailed version of that note.

---

## 1. Tables that remain (from `docs/database.md`, unchanged in principle)

| Table | Purpose | Status |
|---|---|---|
| `profiles` | Staff identity + role, linked to `auth.users`. | Keep. Role set to be narrowed — see §7 (G-1). |
| `properties` | Core listing records. | Keep. Several proposed field changes — see §3. |
| `property_media` | Ordered images per property, stored in Supabase Storage. | Keep. Minor: confirm alt-text is required at publish. |
| `inquiries` | Public leads (property enquiry, general, owner listing). | Keep. Proposed additions: `type`, `assigned_to`, note confidentiality — see §4. |
| `viewing_requests` | Property viewing requests, coordinated manually. | Keep as its own table. Lifecycle values to be set — see §5. |

## 2. Tables proposed to be **added**

| Table | Purpose | Trigger | Priority |
|---|---|---|---|
| `site_settings` | Single-row record holding public contact details and social links so non-developers can update them without a deploy. | Decision **K-1 / H group** (contact info should be editable). | SHOULD-HAVE. Only needed if the owner wants to self-manage contact info; otherwise these values live in configuration. |

## 3. Tables explicitly **not** added in MVP

`owners`, `favorites`, `saved_searches`, `agents` (agents are `profiles` rows),
`services` / `pages` / `articles` / `faqs` / `areas` / `testimonials` (CMS tables),
`audit_log`. Each is a clean additive change later. Governed by ADR-004, ADR-005,
ADR-007.

---

## 3. `properties` — proposed field-level changes

| Field | Current in `docs/database.md` | Proposed change | Depends on decision |
|---|---|---|---|
| `listing_type` | `text` (unspecified values) | Constrain to `rent` \| `sale` (+ `short_let` only if 2.d = yes). | **2.a, 2.d** |
| `property_type` | `text` (unspecified) | Constrain to an approved controlled list. | **8.b** |
| `status` | `text` (values not listed) | Constrain to the §9 lifecycle: `draft` \| `published` \| `unavailable` \| `let_or_sold` \| `archived`. | **9.a, 9.b** (whether `under_offer` is added) |
| `price` | `numeric` | Allow `NULL` if "Price on request" is permitted. | **8.c** |
| `price_period` | — | Add only if short-term lets are in scope. | **2.d** |
| `currency` | `text default 'KES'` | Keep. Single currency; multi-currency is Future. | — |
| `county` / `area` / `location_name` | `text` | Constrain `county` / `area` to the approved location list; keep building/estate as free text. | **6.a** |
| `latitude` / `longitude` | `numeric nullable` | Keep, stored but not displayed in MVP (no map). | — |
| address line | — | Add a staff-only address field; **not** shown publicly by default. | **8.e** |
| `bedrooms` / `bathrooms` | `integer` / `numeric` nullable | Keep nullable (land/commercial have none). | 2.c |
| `size_value` / `size_unit` | nullable | Keep; not a launch filter. | — |
| `amenities` | `jsonb` | Validate against an approved vocabulary in the service layer. | **8.d** |
| `featured` / `verified` | `boolean` | Keep. Write access restricted to `admin` (§7). | G-1 |
| `reference_code` | `text unique` | Keep unique; confirm the generation rule/format. | **8.a** (default `KP-####`) |
| `slug` | `text unique` | Keep unique; define immutability + 301 policy on change. | — (technical) |
| `agent_id` | — | Add `uuid` FK → `profiles(id)`, nullable, `ON DELETE SET NULL` (assigned/contact agent). | 19.a |
| `available_from` | — | Add `date` nullable (optional, useful for rentals). | — |
| `owner_name` / `owner_phone` / `owner_email` | — | Add nullable staff-only free-text fields. | **10.a** |
| `published_at` | `timestamptz nullable` | Keep; set on first publish; drives sitemap + default sort. | — |
| `created_by` / `created_at` / `updated_at` | present | Keep. | — |

---

## 4. `inquiries` — proposed changes

| Field | Current | Proposed change | Depends on |
|---|---|---|---|
| `type` | — | Add: `property_enquiry` \| `general` \| `owner_listing`. | ADR-004 (owner leads), form design |
| `property_id` | `uuid nullable` | Keep nullable (null for `general` / `owner_listing`). FK delete behaviour → `SET NULL`. | **28.a** (default chosen) |
| `preferred_contact_method` | `text` | Constrain to `phone` \| `whatsapp` \| `email`. | — |
| `status` | `text` | Constrain to `new` \| `contacted` \| `in_progress` \| `closed`. | 18 (owner may rename stages) |
| outcome | — | Optional: small enum (`won` \| `lost` \| `no_response` \| `not_proceeding`) + note. | **13.a** |
| `assigned_to` | — | Add `uuid` FK → `profiles(id)`, nullable, `ON DELETE SET NULL`. | 19.a |
| `internal_notes` | `text nullable` | **Must be unreachable by public/anon roles.** Row-level policies do not restrict columns — implement via a public-safe view **or** move notes to a separate `inquiry_notes` table with its own policy. **This is an open schema-design decision.** | Security (§22), design |

## 5. `viewing_requests` — proposed changes

| Field | Current | Proposed change | Depends on |
|---|---|---|---|
| `status` | `text` | Constrain to `new` \| `scheduled` \| `completed` \| `cancelled`. | 13 (workflow) |
| `preferred_time` | `text` | Keep free text, or use a coarse enum (`morning` \| `afternoon` \| `evening`). | Minor — technical default: free text |
| internal notes | present in `docs/database.md`? no | If notes are added, same column-confidentiality rule as `inquiries`. | Security (§22) |
| `property_id` | `uuid` | Required (a viewing is always property-bound). FK → `properties(id)`. | — |

## 6. `profiles` — proposed changes

| Field | Current | Proposed change | Depends on |
|---|---|---|---|
| `role` | `text` — example set `admin` \| `agent` \| `editor` | Narrow to `admin` \| `agent` for MVP (drop `editor`). Enforce with an enum or `CHECK`. | **G-1 / ADR-007** |
| others | `full_name`, `phone`, timestamps | Keep. | — |

---

## 7. Relationships

| From | To | On delete | Notes |
|---|---|---|---|
| `profiles.id` | `auth.users.id` | `CASCADE` | Standard Supabase pattern. |
| `property_media.property_id` | `properties.id` | `CASCADE` | Media has no meaning without its property. |
| `properties.created_by` | `profiles.id` | `SET NULL` | Preserve the listing if a staff member leaves. |
| `properties.agent_id` | `profiles.id` | `SET NULL` | Assigned agent optional. |
| `inquiries.property_id` | `properties.id` | `SET NULL` | Keep the lead even if the property is removed (**28.a**). |
| `inquiries.assigned_to` | `profiles.id` | `SET NULL` | |
| `viewing_requests.property_id` | `properties.id` | `SET NULL` or `RESTRICT` | MVP archives rather than deletes, so either is safe; default `SET NULL`. |

---

## 8. Indexes likely required

| Table | Index | Reason |
|---|---|---|
| `properties` | `(status, published_at DESC)` | Default public list + "latest" homepage query. |
| `properties` | `(listing_type, property_type)` | Primary filter combination. |
| `properties` | `(county, area)` | Location filter. |
| `properties` | `(price)` | Price-range filter + price sort. |
| `properties` | partial `(featured) WHERE status = 'published'` | Homepage featured strip. |
| `properties` | `UNIQUE (slug)`, `UNIQUE (reference_code)` | Lookup + integrity. |
| `properties` | `GIN` on a `tsvector` (title, area, town, description) | Full-text keyword search — SHOULD-HAVE phase; `ILIKE` acceptable at first. |
| `property_media` | `(property_id, sort_order)` | Ordered gallery fetch. |
| `inquiries` | `(status, created_at DESC)`, `(type)`, `(property_id)`, `(assigned_to)` | Staff lead queues and filters. |
| `viewing_requests` | `(status, created_at DESC)`, `(property_id)` | Staff viewing queue. |

Exact index list is finalised with the schema; the above is the expected set from
the query patterns in `docs/product-definition.md` §11, §12, §18.

---

## 9. RLS requirements (policy intent — not policy SQL)

| Role | `properties` | `property_media` | `inquiries` / `viewing_requests` | `profiles` | `site_settings` |
|---|---|---|---|---|---|
| **anon / public** | `SELECT` where `status = 'published'` only. No write. | `SELECT` only for media of published properties. | `INSERT` only, restricted column set, `status` forced to default, **no** `internal_notes` / `assigned_to` / outcome. No `SELECT` / `UPDATE` / `DELETE`. | No access. | `SELECT` only. |
| **agent** | `SELECT` all; `INSERT` / `UPDATE` (edit scope per **19.a**); lifecycle transitions; **not** `featured` / `verified`. `archive` per **19.b**. | Full manage for any property. | `SELECT` all; `UPDATE` status / `assigned_to` / notes. | `SELECT` own row (+ others' names for assignment). | No write. |
| **admin** | Everything `agent` can, **plus** `featured` / `verified` writes and hard-delete via console only. | Full. | Full. | Manage staff rows + roles. | `UPDATE`. |

**Open RLS-shaping decisions:** 19.a (agent edit scope), 19.b (agent archive),
G-1 (role set), and the `internal_notes` confidentiality mechanism (view vs.
separate table).

**Backstops:** every write is Zod-validated in the service layer; DB `CHECK` /
`NOT NULL` / enum constraints mirror the Zod rules; anon `INSERT` policies must
enumerate the exact allowed columns.

---

## 10. Storage requirements

| Bucket | Read | Write | Constraints | Depends on |
|---|---|---|---|---|
| `property-media` | Public | Authenticated staff only | MIME allowlist (`image/jpeg`, `png`, `webp`, `avif`); max size per file; optional derived/resized renditions. | **O-6** (default 8 MB / ~20 images), O-5 (resize approach) |
| branding | n/a — shipped in the app bundle (`frontend/public/assets/branding/`), not Storage. | — | — | 25.b (asset pack) |
| documents (contracts, owner docs) | — | — | **Not in MVP.** Future bucket with staff-only read/write. | — |

---

## 11. Unresolved, business-dependent schema decisions

These **must** be settled before `docs/database.md` is finalised:

| Ref | Blocks the schema until decided |
|---|---|
| 2.a / 2.d | `listing_type` value set. |
| 2.c | Which `property_type` values exist; whether bedroom/bathroom fields are ever required. |
| 6.a | The `county` / `area` controlled lists (also needed for seed data). |
| 8.b | `property_type` controlled list. |
| 8.c | Whether `price` is nullable. |
| 8.d | `amenities` vocabulary (validation set). |
| 8.e | Whether a public address field exists at all, or only a staff-only one. |
| 9.a / 9.b | `status` value set (is `under_offer` a separate state?). |
| 10.a | Whether `owner_*` fields are added to `properties`. |
| 13.a | Whether an `inquiries` outcome column/enum exists. |
| 18 | Final names of the `inquiries.status` stages. |
| 19.a / 19.b / G-1 | RLS policy shape and the `profiles.role` value set. |
| security | `internal_notes` confidentiality: public-safe view vs. `inquiry_notes` table. |
| K-1 | Whether `site_settings` is created at all. |

---

## FINAL DATABASE DESIGN MUST BE APPROVED BEFORE PHASE 2 MIGRATIONS.

The sequence is:

1. Business owner answers `docs/business-owner-questionnaire.md`.
2. Open decisions in `docs/phase-0-decision-register.md` are resolved.
3. `docs/database.md` is reworked into a final, approvable schema reflecting those answers and this readiness check.
4. A human approves the final `docs/database.md`.
5. **Only then** — in Phase 2 — are migrations written.

No migration, no `supabase` project, and no schema SQL may be created before step 4.
