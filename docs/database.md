# K Pearl Agency — Database Design

> **Phase 0 note (2026-08-27):** `docs/product-definition.md` §28 lists proposed
> deltas to this design arising from the Phase 0 discovery — e.g. `properties.listing_type`
> (`rent`/`sale`), a revised `status` lifecycle (`draft` → `published` →
> `unavailable`/`let_or_sold` → `archived`), `agent_id` on `properties`, a `type`
> discriminator + `assigned_to` on `inquiries`, column-confidential `internal_notes`,
> a `role` set limited to `admin`/`agent`, an optional `site_settings` singleton, and
> deliberately **omitted** tables (`owners`, `favorites`, CMS tables). Those are
> proposals pending approval. This document remains the design contract and must be
> reworked in a dedicated pass once the §31 open decisions are resolved — before any
> migration is written in Phase 2.

## Principles

- PostgreSQL through Supabase.
- UUID primary keys.
- Timestamps in UTC.
- RLS enabled on every application table.
- Foreign keys with deliberate delete behavior.
- Index columns used by public filtering/search.
- Public visibility is explicit.

## Core tables

### profiles
Staff/user profile information.

Suggested fields:
- `id uuid primary key references auth.users(id)`
- `full_name text`
- `phone text`
- `role text`
- `created_at timestamptz`
- `updated_at timestamptz`

Roles should be a controlled set, for example:
- `admin`
- `agent`
- `editor`

### properties
Core property records.

Suggested fields:
- `id uuid`
- `title text`
- `slug text unique`
- `reference_code text unique`
- `listing_type text`
- `property_type text`
- `status text`
- `price numeric`
- `currency text default 'KES'`
- `location_name text`
- `county text`
- `area text`
- `latitude numeric nullable`
- `longitude numeric nullable`
- `bedrooms integer nullable`
- `bathrooms numeric nullable`
- `size_value numeric nullable`
- `size_unit text nullable`
- `description text`
- `amenities jsonb`
- `featured boolean`
- `verified boolean`
- `published_at timestamptz nullable`
- `created_by uuid`
- `created_at timestamptz`
- `updated_at timestamptz`

### property_media
- `id uuid`
- `property_id uuid`
- `storage_path text`
- `alt_text text`
- `sort_order integer`
- `is_cover boolean`
- `created_at timestamptz`

### inquiries
- `id uuid`
- `property_id uuid nullable`
- `name text`
- `phone text`
- `email text nullable`
- `message text`
- `preferred_contact_method text`
- `status text`
- `internal_notes text nullable`
- `created_at timestamptz`
- `updated_at timestamptz`

### viewing_requests
- `id uuid`
- `property_id uuid`
- `name text`
- `phone text`
- `email text nullable`
- `preferred_date date nullable`
- `preferred_time text nullable`
- `message text nullable`
- `status text`
- `created_at timestamptz`
- `updated_at timestamptz`

## RLS baseline

Public:
- SELECT only published/active properties.
- SELECT only property media belonging to publicly visible properties.
- INSERT inquiries/viewing requests with validated public fields.
- No public UPDATE/DELETE.

Staff:
- Read/manage according to role.

Admin:
- Full staff management where explicitly required.

## Important

This document is the design contract, not a finished migration. The actual SQL migration must be created only after the requirements and exact role model are approved.
