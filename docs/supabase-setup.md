# K Pearl Agency — Supabase setup guide

How to stand up the **hosted** Supabase project and connect it to the code. Local
development already works (`npx supabase start`); this is the production/staging
backend. Do this once. It is an **owner task** — it needs your Supabase login and
billing decisions.

Everything the app needs is in `supabase/migrations/` (schema, RLS, storage,
reference data). There is **no manual SQL step** — `supabase db push` does it all.

---

## 0. Prerequisites

- A Supabase account: https://supabase.com
- The CLI (already a dev dependency): run it with `npx supabase ...` from the repo root.
- Docker running (only for local work, not for the hosted steps).

---

## 1. Create the hosted project

1. https://supabase.com/dashboard → **New project**.
2. **Name:** `k-pearl-agency`
3. **Database password:** generate a strong one and store it in a password manager.
   You will need it in step 3.
4. **Region:** pick the closest to Kenya — **`West EU (London)`** or
   **`Central EU (Frankfurt)`** are the usual best latency; `South Asia (Mumbai)`
   is an alternative. Pick one and keep it.
5. **Plan:** Free is fine to start. (Note: the Free tier pauses a project after
   ~1 week of no activity — fine during build, revisit before real launch.)
6. Wait for provisioning (~2 min).
7. Copy the **Project ref** — the string in the dashboard URL
   `https://supabase.com/dashboard/project/<PROJECT_REF>` (also under
   **Project Settings → General**).

---

## 2. Log the CLI in

From the repo root:

```bash
npx supabase login
```

This opens a browser to create an access token, then stores it locally.

---

## 3. Link this repo to the project

```bash
npx supabase link --project-ref <PROJECT_REF>
```

It will prompt for the **database password** from step 1.

This writes the link into `supabase/.temp/` (git-ignored). The local port
remapping in `config.toml` (553xx) does **not** affect the hosted project.

---

## 4. Push the schema

```bash
npx supabase db push
```

This applies every migration in `supabase/migrations/` to the hosted database, in
order:

| # | Migration | What it creates |
|---|---|---|
| 01 | profiles | `profiles` table, `handle_new_user` trigger, `is_staff()` / `is_admin()` |
| 02 | areas | service-location reference table |
| 03 | properties | listings + `KP-####` reference sequence + `published_at` trigger |
| 04 | property_media | image metadata |
| 05 | inquiries | property enquiries + general messages |
| 06 | viewing_requests | viewing requests |
| 07 | property_submissions | "list your property" review queue (ADR-009) |
| 08 | site_settings | single row of public contact info |
| 09 | public_views | `public_properties` / `public_property_media` (hide staff-only columns) |
| 10 | rls_policies | all Row Level Security + grants |
| 11 | storage | `property-media` bucket + object policies |
| 12 | reference_data | the 28 Nairobi-metro areas + the `site_settings` row (idempotent) |

`supabase/seed/seed.sql` (dev staff users + sample listings) is **not** run
against the hosted project — only local `supabase db reset` uses it.

---

## 5. Verify

In the dashboard:

- **Table Editor** → all 9 tables present; `areas` has 28 rows; `site_settings`
  has 1 row with the real phone / WhatsApp / email.
- **Database → Views** → `public_properties`, `public_property_media` present.
- **Storage** → bucket `property-media` exists, marked *public*.
- **Database → Policies** → every table shows RLS enabled with policies.

Quick sanity check from the **SQL Editor** (should return the areas, and an empty
result for a would-be public read of a lead table):

```sql
select count(*) from public.areas;                 -- 28
select * from public.site_settings;                -- 1 row
set local role anon;
select count(*) from public.public_properties;     -- 0 for now (no published listings yet)
select * from public.inquiries;                    -- ERROR / 0 rows: anon cannot read leads
```

---

## 6. Create the first admin user

1. Dashboard → **Authentication → Users → Add user** → enter an email + password
   for yourself. (Public signup is disabled by policy; dashboard-created users are
   fine.)
2. The `handle_new_user` trigger has already created a matching `profiles` row
   with `role = 'agent'`. Promote it in the **SQL Editor**:

```sql
update public.profiles
set role = 'admin',
    full_name = 'Your Name',
    phone = '+254704061324',
    whatsapp = '+254704061324'
where id = (select id from auth.users where email = 'you@example.com');
```

3. Add the other 2–3 staff the same way (leave them as `agent`, set `full_name`
   and `whatsapp`). Assign each agent to their listings later from the admin panel.

---

## 7. Auth configuration

Dashboard → **Authentication → Sign In / Providers → Email**:

- **Enable Signups: OFF** (staff are added by an admin — matches ADR-005).
- **Confirm email: OFF** is fine (admin creates users directly).

Dashboard → **Authentication → URL Configuration** (set now or before deploy):

- **Site URL:** `https://k-pearl-agency.vercel.app`
- **Redirect URLs:** add `https://k-pearl-agency.vercel.app/**`

---

## 8. API keys (for the deployed frontend — Phase 7)

Dashboard → **Project Settings → API**:

- **Project URL** → `VITE_SUPABASE_URL`
- **anon / public key** → `VITE_SUPABASE_ANON_KEY`

These go into the **Vercel** project's environment variables at deploy time. They
are safe to expose (RLS is the security boundary). The **service_role** key is
secret — it is only used by the `notify-lead` Edge Function later, never in the
frontend.

For local development now, keep `frontend/.env` pointed at the local stack
(`http://127.0.0.1:55321` + the local anon key from `npx supabase status`).

---

## 9. Edge Function — `notify-lead`

Implemented in Phase 5 (email path). It emails the assigned agent + all admins on
every new enquiry / viewing request / property submission. The frontend invokes
it fire-and-forget after a successful insert — **no database webhook needed**.

**On the hosted project (once, after `db push`):**

```bash
npx supabase functions deploy notify-lead

# A Gmail App Password (Google Account → Security → 2-Step Verification →
# App passwords) — NOT the account password.
npx supabase secrets set GMAIL_USER=you@gmail.com GMAIL_APP_PASSWORD=xxxxxxxxxxxxxxxx
```

Until the secrets are set, the function logs the intended email instead of
sending (same as local dev) — the visitor's submission still succeeds either way.

WhatsApp notifications are deferred to post-launch (Meta Business verification for
+254704061324); `whatsappSender` is a stub in `senders.ts`.

---

## 9a. Edge Function — `invite-staff` (Phase 6)

Sends a Supabase invite email to a new staff member and sets their profile role.
`verify_jwt = true`; the function also checks the caller's `profiles.role =
'admin'` with the service-role key before inviting. Called from the admin
**Team** page (`/staff/team`).

**On the hosted project (once):**

```bash
npx supabase functions deploy invite-staff
```

No extra secrets — `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` are injected by
the platform. Invite emails need SMTP configured on the project (Auth →
Providers → Email, or `[auth.email.smtp]`); with local dev they land in Mailpit
(`http://127.0.0.1:55324`).

**Auth config:** `[auth].enable_signup = false` blocks public signup;
`[auth.email].enable_signup = true` keeps email logins working (with it `false`
every staff login fails with `email_provider_disabled`).

---

## 10. Ongoing workflow

Whenever the schema changes:

```bash
# 1. write a new timestamped file in supabase/migrations/
# 2. test locally
npx supabase db reset            # re-applies all migrations + local seed
cd frontend && npm run test      # integration tests hit the local stack

# 3. regenerate types
npx supabase gen types typescript --local > frontend/src/types/database.types.ts

# 4. push to the hosted project
npx supabase db push
```

Never edit a migration that has already been pushed — add a new one.
