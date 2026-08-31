# K Pearl Agency — Launch Audit

Phase 7 tranche 2 (ADR-013). Results below are dated; re-run before final
launch sign-off if meaningful time has passed or the app has changed
materially.

## Accessibility

**Automated (axe-core via Playwright, `frontend/e2e/a11y.spec.ts`) — enforced
in CI, part of `npm run test:e2e`.**

| Page | Serious/critical violations |
| --- | --- |
| Home | 0 |
| Properties | 0 |
| Property detail | 0 |
| Contact | 0 |
| Staff dashboard | 0 |

One real finding, fixed: `--color-gold-deep` (`frontend/src/styles/index.css`)
was `#a9863f`, giving ~3.4:1 contrast against ivory/white backgrounds at
normal text size — below the WCAG AA 4.5:1 minimum. It only surfaced on the
staff dashboard's nav links because public-page usages of the same color
happen to be on large text (≥24px), which only needs 3:1. Darkened to
`#866a27` (~5.1:1), which clears AA at any size; also fixed two spots
(`StaffLayout.tsx`, `StaffAuthShell.tsx`) using the lighter `--color-gold`
(meant for dark surfaces) for text on a light surface.

**Lighthouse accessibility category** (`npm run audit:lighthouse`,
confirmatory, not a separate signal — same rendered pages):

| Page | Score |
| --- | --- |
| Home | 100 |
| Properties | 98 |
| Property detail | 100 |
| Contact | 96 |

All ≥95 (CLAUDE.md §10 target). Consistent with the axe results above.

## Performance

**Not yet a reliable reading.** `npm run audit:lighthouse` against a
production build (`vite preview`) on this dev machine returned Performance
scores of 42–55 across all four public pages — well under the ≥90 target.
Diagnosis before treating that as real:

- Largest Contentful Paint ~7.5s, First Contentful Paint ~3.1s, Total
  Blocking Time ~250ms — but Lighthouse's own "opportunities" analysis only
  identified ~750ms of addressable savings (unused JS), nowhere near enough
  to explain a 7.5s LCP. Cumulative Layout Shift was 0.001 (excellent) — a
  structural metric that isn't sensitive to machine load, unlike the timing
  metrics above.
- This machine was running Docker Desktop with **two** full local Supabase
  stacks (`k-pearl-agency` + an unrelated `rental-hunt` project) plus this
  entire session's own tooling at the time of the run. Lighthouse's default
  mobile simulation already applies significant CPU/network throttling on
  top of whatever the host is doing; under real contention that compounds
  into scores that don't reflect the app.

**Action before launch sign-off (Phase 7 tranche 5):** re-run
`npm run audit:lighthouse` on a quiet machine, and — more importantly, since
that's the environment the ≥90 target actually needs to hold for — against
the deployed Vercel production build once it exists. Do not treat the
numbers above as a real regression; do not treat them as cleared either.

## Security

Phase 7 tranche 3. Reviewed `docs/security.md` line by line against both the
repo (migrations, config, git history) and the **hosted** Supabase project
(`k-pearl-agency`, ref `nhfrmeicavehrkwqfpgc`) via the linked Supabase CLI —
read-only checks only (`migration list`, `functions list`, `secrets list`);
no writes made to the hosted project during this review.

### Verified — repo

- **RLS enabled on every table.** All 8 application tables (`profiles`,
  `areas`, `properties`, `property_media`, `inquiries`, `viewing_requests`,
  `property_submissions`, `site_settings`) have a matching
  `alter table ... enable row level security` — no gaps.
- **Public views correctly hide staff-only data.** `public_properties`
  (`20260827090009_public_views.sql`) omits `address_line`, `latitude`,
  `longitude`, `owner_name`, `owner_phone`, `owner_email` and filters to
  `status = 'published'` — matches docs/security.md.
- **Storage policy matches spec**
  (`20260827090011_storage.sql`): `property-media` bucket is public-read,
  staff-only insert/update/delete (`public.is_staff()`), 8 MiB cap, MIME
  allowlist (`jpeg`/`png`/`webp`/`avif`).
- **No secrets ever committed.** Only `.env.example` is tracked (blank
  values); no `.env` in git history; no hardcoded service-role key, Gmail
  password, or JWT secret anywhere in the repo — Edge Functions only read
  `Deno.env.get(...)` at runtime.
- **`verify_jwt` config is correct**: `notify-lead` = `false` (anon lead
  forms must reach it), `invite-staff` = `true` (plus an internal
  admin-role check) — matches docs/security.md's model.

### Verified — hosted project (read-only)

- **Schema is stale — real finding.** `supabase migration list` shows the
  hosted project has migrations through `20260827090012_reference_data`
  applied, but is **missing the two most recent local migrations**:
  `20260828090001_lead_rate_limit` and `20260828100001_staff_rpcs`.
  Concretely, right now, against production: public lead forms (enquiry,
  viewing request, property submission) have **no anti-spam rate limiting**,
  and the entire staff dashboard is broken —
  `staff_dashboard_counts()` and `convert_property_submission()` don't exist
  on the hosted database yet. This resolves the open question from
  `docs/project-state.md` about whether `db push` had landed: partially —
  the initial push happened, but it was never re-run after Phase 5/6 added
  these two migrations.
- **No Edge Functions deployed** (`functions list` → empty) and **no
  secrets set** (`secrets list` → empty). Matches the known owner handoffs
  in `docs/project-state.md` — `invite-staff` and `notify-lead` need
  `supabase functions deploy` + `GMAIL_USER`/`GMAIL_APP_PASSWORD` secrets
  before they'll work.

### Not verified this pass

- Live RLS behavior on the hosted project's *already-pushed* migrations
  (1–12) wasn't independently re-tested against the real REST API — the
  Claude Code permission classifier blocked fetching the hosted anon key
  (reasonable; credential-adjacent even for a public-safe key). Confidence
  is still high: it's the identical SQL already exercised by the local
  integration suite (`staff.integration.test.ts`,
  `lead-forms.integration.test.ts`) across many runs this session — but
  that's local-equivalence, not a live-verified fact.
- Auth redirect URL configuration and first-admin-user creation — both
  owner/console steps per `docs/deployment.md`, not checkable via the CLI.

### Resolved

Owner confirmed pushing the missing migrations. `supabase db push` applied
`20260828090001_lead_rate_limit` and `20260828100001_staff_rpcs` to the
hosted project (2026-08-31); `migration list` now shows all 14 local
migrations matched on remote. Lead-form rate limiting and the staff
dashboard RPCs are live on production as of this change.

Still open (owner/console, not checkable via CLI): deploy
`invite-staff`/`notify-lead`, set their secrets, configure auth redirect
URLs, create the first admin user.
