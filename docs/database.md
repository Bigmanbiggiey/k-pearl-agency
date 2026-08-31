# K Pearl Agency — Database Design

> Version: 2.0 — **finalised for Phase 2** from the answered business-owner
> questionnaire (2026-08-27) and ADR-002 … ADR-010.
> This is the design contract the Phase 2 migrations implement. Changes after
> migrations exist go in a **new** migration, never by editing an applied one.

## Principles

- PostgreSQL via Supabase. UUID primary keys (`gen_random_uuid()`). Timestamps
  `timestamptz`, UTC, `created_at`/`updated_at` with an `updated_at` trigger.
- **Enums as `text` + `CHECK`**, not PG `enum` types — easier to extend later.
- RLS enabled on every table. Public visibility is explicit and additionally
  filtered through views that drop staff-only columns.
- Foreign keys with deliberate delete behaviour.
- Index every column used by public filtering, sorting or search.
- No secrets in the database. The service-role key is server-side only.

## Enumerated values (single source of truth)

| Concept | Values |
|---|---|
| `profiles.role` | `admin`, `agent` |
| `properties.listing_type` | `rent`, `sale`, `short_let` |
| `properties.price_period` | `month`, `night`, `week` (null for `sale`) |
| `properties.property_type` | `apartment`, `house`, `townhouse`, `maisonette`, `studio`, `bedsitter`, `office`, `shop`, `land` |
| `properties.status` | `draft`, `published`, `unavailable`, `let_or_sold`, `archived` |
| `properties.currency` | `KES` (only value for MVP) |
| `inquiries.type` | `property_enquiry`, `general` |
| `inquiries.status` | `new`, `contacted`, `in_progress`, `closed` |
| `inquiries.preferred_contact_method` | `phone`, `whatsapp`, `email` |
| `viewing_requests.status` | `new`, `scheduled`, `completed`, `cancelled` |
| `viewing_requests.preferred_time` | `morning`, `afternoon`, `evening` (nullable) |
| `property_submissions.status` | `new`, `in_review`, `converted`, `declined` |

These strings must match `frontend/src/types/domain.ts`.

## Tables

### profiles
Staff identity, linked 1:1 to `auth.users`. Created by a trigger on `auth.users`
insert (role defaults to `agent`; an admin promotes).

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | `references auth.users(id) on delete cascade` |
| `full_name` | `text` | |
| `phone` | `text` null | |
| `whatsapp` | `text` null | E.164; used by `notify-lead` to route alerts (ADR-010) |
| `role` | `text` not null default `'agent'` | `check (role in ('admin','agent'))` |
| `created_at` / `updated_at` | `timestamptz` not null default `now()` | |

### areas
Admin-managed reference list of service locations (questionnaire Q4 — Nairobi and
environs, open-ended).

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `county` | `text` not null | e.g. `Nairobi`, `Kiambu`, `Kajiado`, `Machakos` |
| `name` | `text` not null | e.g. `Kilimani`, `Kitengela` |
| `slug` | `text` not null unique | url-safe |
| `is_active` | `boolean` not null default `true` | |
| `sort_order` | `integer` not null default `0` | |
| `created_at` / `updated_at` | `timestamptz` | |

Unique `(county, name)`.

### properties
Core listing records. Staff-created.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `title` | `text` not null | |
| `slug` | `text` not null unique | immutable once published; slug change → 301 (app concern) |
| `reference_code` | `text` not null unique | `KP-` + zero-padded sequence (`KP-0042`) |
| `listing_type` | `text` not null | `check in ('rent','sale','short_let')` |
| `price_period` | `text` null | `check in ('month','night','week')`; enforce non-null for rent/short_let, null for sale via a row `CHECK` |
| `property_type` | `text` not null | `check in (…9 values…)` |
| `status` | `text` not null default `'draft'` | `check in ('draft','published','unavailable','let_or_sold','archived')` |
| `price` | `numeric(12,2)` null | null ⇒ "Price on request" (Q15) |
| `currency` | `text` not null default `'KES'` | `check (currency = 'KES')` for MVP |
| `area_id` | `uuid` null | `references areas(id) on delete set null` |
| `address_line` | `text` null | **staff-only** — excluded from `public_properties` (Q16) |
| `latitude` | `numeric(9,6)` null | **staff-only** |
| `longitude` | `numeric(9,6)` null | **staff-only** |
| `bedrooms` | `integer` null | null for land/commercial |
| `bathrooms` | `numeric(3,1)` null | allows `2.5` |
| `size_value` | `numeric(10,2)` null | |
| `size_unit` | `text` null | `check in ('sqm','sqft','acre','ha')` |
| `description` | `text` not null default `''` | |
| `amenities` | `jsonb` not null default `'[]'` | array of slugs from the amenity vocabulary (below) |
| `featured` | `boolean` not null default `false` | admin-only write |
| `verified` | `boolean` not null default `false` | admin-only write |
| `available_from` | `date` null | |
| `agent_id` | `uuid` null | `references profiles(id) on delete set null`; the assigned/contact agent; drives RLS write scope |
| `owner_name` | `text` null | **staff-only** (Q17, optional) |
| `owner_phone` | `text` null | **staff-only** |
| `owner_email` | `text` null | **staff-only** |
| `published_at` | `timestamptz` null | set on first transition to `published` |
| `created_by` | `uuid` null | `references profiles(id) on delete set null` |
| `created_at` / `updated_at` | `timestamptz` not null default `now()` | |

**Amenity vocabulary (starter — owner trims in Phase 3/4):** `parking`,
`borehole`, `mains_water`, `backup_power`, `solar_water`, `lift`, `gym`,
`swimming_pool`, `balcony`, `furnished`, `air_conditioning`, `gated_community`,
`cctv`, `24h_security`, `pet_friendly`, `garden`, `dsq` (staff quarters),
`ensuite`, `fibre_internet`, `wheelchair_access`.

### property_media
Ordered images per property. Files live in Supabase Storage.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `property_id` | `uuid` not null | `references properties(id) on delete cascade` |
| `storage_path` | `text` not null | key in the `property-media` bucket |
| `alt_text` | `text` not null default `''` | required to be non-empty at publish (app rule) |
| `sort_order` | `integer` not null default `0` | |
| `is_cover` | `boolean` not null default `false` | at most one true per property (partial unique index) |
| `created_at` | `timestamptz` not null default `now()` | |

### inquiries
Public leads: property enquiries and general messages (Q13). `owner_listing` is
**not** here — it goes to `property_submissions` (ADR-009).

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `type` | `text` not null | `check in ('property_enquiry','general')` |
| `property_id` | `uuid` null | `references properties(id) on delete set null` (null for `general`) |
| `name` | `text` not null | |
| `phone` | `text` not null | |
| `email` | `text` null | |
| `message` | `text` not null | |
| `preferred_contact_method` | `text` not null | `check in ('phone','whatsapp','email')` |
| `status` | `text` not null default `'new'` | `check in ('new','contacted','in_progress','closed')` |
| `assigned_to` | `uuid` null | `references profiles(id) on delete set null` |
| `internal_notes` | `text` null | staff-only; safe because public has **no `SELECT`** on this table |
| `created_at` / `updated_at` | `timestamptz` not null default `now()` | |

### viewing_requests
Capture-only (ADR-006). Own table.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `property_id` | `uuid` not null | `references properties(id) on delete set null` — always property-bound at creation |
| `name` | `text` not null | |
| `phone` | `text` not null | |
| `email` | `text` null | |
| `preferred_date` | `date` null | |
| `preferred_time` | `text` null | `check in ('morning','afternoon','evening')` |
| `message` | `text` null | |
| `status` | `text` not null default `'new'` | `check in ('new','scheduled','completed','cancelled')` |
| `assigned_to` | `uuid` null | `references profiles(id) on delete set null` |
| `internal_notes` | `text` null | staff-only (no public `SELECT`) |
| `created_at` / `updated_at` | `timestamptz` not null default `now()` | |

### property_submissions
Owner-submitted listing details, queued for staff review (ADR-009).

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `submitter_name` | `text` not null | |
| `submitter_phone` | `text` not null | |
| `submitter_email` | `text` null | |
| `submitter_notes` | `text` null | free message from the owner |
| `proposed_title` | `text` not null | |
| `proposed_listing_type` | `text` not null | `check in ('rent','sale','short_let')` |
| `proposed_property_type` | `text` not null | `check` — same 9 values |
| `proposed_area_id` | `uuid` null | `references areas(id) on delete set null` |
| `proposed_price` | `numeric(12,2)` null | |
| `proposed_bedrooms` | `integer` null | |
| `proposed_bathrooms` | `numeric(3,1)` null | |
| `proposed_description` | `text` null | |
| `status` | `text` not null default `'new'` | `check in ('new','in_review','converted','declined')` |
| `reviewed_by` | `uuid` null | `references profiles(id) on delete set null` |
| `converted_property_id` | `uuid` null | `references properties(id) on delete set null` |
| `created_at` / `updated_at` | `timestamptz` not null default `now()` | |

### site_settings
Single row of editable public contact info (Q7–Q12).

| Column | Type | Notes |
|---|---|---|
| `id` | `boolean` PK default `true` | `check (id)` — enforces one row |
| `phone` | `text` not null | `+254180558075` |
| `whatsapp` | `text` not null | `+254180558075` |
| `email` | `text` not null | `k.pearlagency@gmail.com` |
| `hours_weekday` | `text` not null | `Mon–Fri 8:00 AM – 5:00 PM` |
| `hours_weekend` | `text` not null | `Sat–Sun 9:00 AM – 2:00 PM` |
| `by_appointment` | `boolean` not null default `true` | no public office address |
| `updated_at` | `timestamptz` not null default `now()` | |

## Public views (column-hiding for `anon`)

Postgres RLS is row-level; to keep staff-only columns away from the public the
public read paths go through views:

- **`public_properties`** — `select … from properties where status = 'published'`,
  exposing only: `id, title, slug, reference_code, listing_type, price_period,
  property_type, price, currency, area_id, bedrooms, bathrooms, size_value,
  size_unit, description, amenities, featured, verified, available_from,
  published_at, created_at`. **Excludes** `address_line`, `latitude`, `longitude`,
  `owner_*`, `agent_id`, `created_by`, `status`.
- **`public_property_media`** — media rows whose property is `published`.
- Both created `with (security_invoker = true)` and `security_barrier = true`;
  `grant select` to `anon, authenticated`; base-table `select` is **not** granted
  to `anon`.
- Staff read the base tables directly (RLS below).

## RLS policies (intent — SQL in the migrations)

| Role | properties / property_media | areas | inquiries / viewing_requests / property_submissions | profiles | site_settings |
|---|---|---|---|---|---|
| **anon** | none on base tables. Reads `public_properties` / `public_property_media` only. | `select` where `is_active` | `insert` only, explicit column allowlist, `status` forced to default, no `assigned_to` / `internal_notes` / `reviewed_by`. **No `select`.** | none | `select` |
| **agent** (`authenticated`, `profiles.role='agent'`) | `select` all; `insert`; `update`/`delete` **only** where `agent_id = auth.uid()` (media: where parent property is theirs) | `select` all | `select` all; `update` `status` / `assigned_to` / `internal_notes` (and submission review fields) | `select` all; `update` own row | `select` |
| **admin** (`profiles.role='admin'`) | full | full (`insert`/`update`/`delete`) | full incl. convert/decline | full | `update` |

Helper: `public.is_admin()` / `public.current_role()` `security definer` functions
reading `profiles.role` for `auth.uid()`.

Backstops: every write also validated by Zod in the service layer; `CHECK` /
`NOT NULL` mirror the Zod rules; `anon` `INSERT` policies enumerate allowed columns.

## Storage

Bucket **`property-media`** (created in a migration):
- Public `select`.
- `insert` / `update` / `delete` for `authenticated` users whose `profiles.role`
  is `admin` or `agent`.
- Object path convention: `properties/{property_id}/{uuid}.{ext}`.
- MIME allowlist `image/jpeg`, `image/png`, `image/webp`, `image/avif`; 8 MB cap
  (enforced in the bucket config + app).

## Auth

- Email + password. **No public signup UI.** No MFA for MVP (Q22).
- Staff added by an admin via `auth.admin.inviteUserByEmail` (an admin-only Edge
  Function or the Supabase dashboard).
- `handle_new_user()` trigger inserts a `profiles` row (`role = 'agent'`); an admin
  promotes to `admin`.
- The first admin is seeded (local) / set manually (production bootstrap).

## Indexes

- `properties (status, published_at desc)`, `(listing_type, property_type)`,
  `(area_id)`, `(price)`, `unique (slug)`, `unique (reference_code)`,
  partial `(featured) where status = 'published'`.
- `property_media (property_id, sort_order)`, partial unique
  `(property_id) where is_cover`.
- `inquiries (status, created_at desc)`, `(type)`, `(assigned_to)`, `(property_id)`.
- `viewing_requests (status, created_at desc)`, `(property_id)`.
- `property_submissions (status, created_at desc)`.
- `areas (county, is_active)`, `unique (slug)`, `unique (county, name)`.

## Reference-code generation

A sequence `property_reference_seq` + a `BEFORE INSERT` trigger sets
`reference_code = 'KP-' || lpad(nextval('property_reference_seq')::text, 4, '0')`
when null.

## Seed (`supabase/seed/seed.sql`) — development only

- `areas`: Nairobi neighbourhoods (Kilimani, Kileleshwa, Lavington, Westlands,
  Parklands, Karen, Lang'ata, Runda, Kitisuru, Ridgeways, South B, South C,
  Donholm, Embakasi, Roysambu, Kasarani) + satellite towns with their county
  (Kitengela/Kajiado, Ongata Rongai/Kajiado, Ngong/Kajiado, Athi River/Machakos,
  Syokimau/Machakos, Mlolongo/Machakos, Kiambu Town/Kiambu, Kiambu Road/Kiambu,
  Ruaka/Kiambu, Ruiru/Kiambu, Juja/Kiambu, Thika/Kiambu).
- `site_settings`: the real contact values above.
- Dev staff: one `admin`, one `agent` (local auth users) — **not for production**.
- ~8 sample `properties` across listing types / areas / property types, with 2–3
  `property_media` placeholder rows each — **not for production**; real photography
  comes from the owner in Phase 3/4.

## Not in MVP (additive later)

`owners` table / owner portal · `favorites` · `saved_searches` · CMS tables
(`services`, `articles`, `faqs`, `testimonials`) · `audit_log` · multi-currency.
