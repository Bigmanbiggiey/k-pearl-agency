# K Pearl Agency — Deployment

## Target (confirmed 2026-08-27)

Frontend:
- **Vercel**, launch URL **`K-Pearl-Agency.vercel.app`** (free subdomain).
- A custom domain (`.co.ke` / `.com`) is deferred to post-launch. A `*.vercel.app`
  subdomain is indexable but carries less authority — acquiring a domain is a
  recommended early follow-up (also needed for a branded / reliable email sender).

Backend:
- Supabase hosted project, **owned by K Pearl** (created by the owner; the project
  delivers reviewed migrations ready to `supabase db push`).

## Environments

- **local** — `npx supabase start` (Docker); the only environment used during
  Phases 2–6 development.
- **production** — the hosted Supabase project + Vercel production deployment.
- A staging environment is optional for MVP; add it if release cadence needs it.

Never connect local development to production data.

## Frontend environment

Only public/non-sensitive values (Vercel project env vars):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Never expose:
- Supabase service-role key
- the Gmail SMTP app password (used by the `notify-lead` Edge Function)
- the WhatsApp Cloud API token (added later)
- any third-party private API key

## Analytics

**Vercel Web Analytics** — enabled on the Vercel project; `@vercel/analytics`
mounted in the app (Phase 3). Privacy-friendly, no cookie banner required.

## Supabase

Production uses the reviewed migrations in `supabase/migrations/`. Bootstrap:
1. `supabase link` to the hosted project.
2. `supabase db push`.
3. Seed **production** `areas` and `site_settings` only (never the dev staff /
   sample properties from `supabase/seed/seed.sql`).
4. Create the first admin user, then set `profiles.role = 'admin'`.
5. Configure auth redirect URLs for `https://k-pearl-agency.vercel.app`.
6. Set Edge Function secrets: `GMAIL_USER`, `GMAIL_APP_PASSWORD` (and later
   `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_ID`).
7. Deploy `notify-lead`; wire the database webhook.

Before launch:
- RLS enabled and tested (anon read via public views only; agent = assigned-only)
- storage policies reviewed (`property-media`: staff write, public read, MIME/size)
- auth redirect URLs configured
- Privacy Policy + Terms published (legal review complete)
- Kenya Data Protection Act 2019 checklist complete
- backups/recovery understood
- production content reviewed (real photography, approved copy)
