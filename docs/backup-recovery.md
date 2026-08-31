# K Pearl Agency — Backup & Recovery

Phase 7 tranche 5. What can be rebuilt from git, what cannot and must be
backed up, and how to recover. Roadmap item "Backup/recovery verification".

## What's reproducible from git (no backup needed)

| Asset | Source | Rebuild |
| --- | --- | --- |
| DB schema, RLS, storage policies, triggers, RPCs | `supabase/migrations/` (14 files) | `npx supabase db push` |
| Reference data — 28 Nairobi-metro areas, the `site_settings` row | migration `20260827090012_reference_data` (idempotent) | applied by `db push` |
| Entire frontend | the repo, any commit | Vercel redeploys from the commit; nothing to restore |
| Edge Functions (`notify-lead`, `invite-staff`) | `supabase/functions/` | `npx supabase functions deploy` |

A total loss of the Vercel project or the Supabase *structure* is recovered
by `db push` + `functions deploy` + a Vercel redeploy + re-setting the Edge
Function secrets and auth URLs (`docs/go-live-runbook.md` §1–§2). No data
backup is involved in that path.

The dev seed (`supabase/seed/seed.sql` — fake staff + sample listings) is
**never** applied to production.

## What is NOT reproducible — must be backed up

- **Application rows:** `properties`, `property_media`, `inquiries`,
  `viewing_requests`, `property_submissions`, `site_settings` (if edited in
  the admin panel away from the seeded values), `profiles`.
- **Auth users:** `auth.users` — the staff logins. Losing these means
  re-inviting every staff member.
- **Storage objects:** everything in the `property-media` bucket (all
  uploaded property photography). This is the single most valuable
  non-reproducible asset and the owner supplies no local copies.

## Supabase backup posture by plan

| | Free | Pro |
| --- | --- | --- |
| Automated backups | Daily, ~7-day retention, **download not guaranteed** | Daily + **Point-in-Time Recovery** |
| Storage objects in backups | Not covered — DB only | Not covered — DB only |
| Project pauses when idle | Yes, after ~1 week | No |

Two consequences:

1. **Move to Pro before real launch.** The idle-pause alone makes Free unfit
   for a live site, and PITR is the realistic recovery story.
2. **Storage is never in the automated backup** on either plan. Property
   photos must be exported separately.

## Manual backup (do before launch, then on a schedule)

Run from the repo root with the CLI linked to the hosted project.

**Database:**
```bash
npx supabase db dump --file backups/kpearl-db-$(date +%Y%m%d).sql          # data + schema
npx supabase db dump --data-only --file backups/kpearl-data-$(date +%Y%m%d).sql
```
(Or Dashboard → Database → Backups → download.)

**Storage (`property-media`):** Dashboard → Storage → `property-media` →
select all → Download, or script it with the JS client / S3 protocol
(`STORAGE_S3_URL`, keys under Project Settings → Storage). Keep the export
**off** Supabase (owner's Drive, an object store, etc.).

**Cadence:** weekly once listings are being managed, or before/after any bulk
change. Keep at least the last 4.

## Recovery drill (run once, record the date below)

1. Create a throwaway Supabase project.
2. `npx supabase db push` (schema), then restore the dump:
   `psql "<throwaway-db-url>" -f backups/kpearl-db-YYYYMMDD.sql`.
3. Check row counts against expectations
   (`select count(*) from properties;` etc.) and one public read via the
   `anon` role.
4. Upload a couple of objects from the Storage export and confirm they serve.
5. Tear the throwaway project down.

For a real incident on Pro: Dashboard → Database → Backups → **Restore** (or
PITR to a timestamp), then re-import Storage objects from the latest export,
then redeploy the frontend (unchanged) if needed.

### Drill log

| Date | By | DB restore | Storage restore | Notes |
| --- | --- | --- | --- | --- |
| _pending_ | | | | first drill before launch |
