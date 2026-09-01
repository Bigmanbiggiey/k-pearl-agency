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

### Update — Phase 7 tranche 5

The tranche-2 `a11y.spec.ts` ran axe immediately after `page.goto`, before
the SPA had finished rendering async content — so on data-dependent pages it
was scanning an incomplete DOM. Tranche 5 added
`await expect(page.getByRole('heading', { level: 1 })).toBeVisible()` before
each scan, which surfaced **two real, pre-existing violations**, both now
fixed:

- **Properties — `select-name` (critical).** The "Property type" and "Area"
  `<select>`s in `PropertyFilters.tsx` had an `id` but their visible label
  was a plain `<p>` (via the local `Fieldset` helper), not associated. Added
  `aria-label` to each, matching the `aria-label` pattern the price inputs in
  the same file already use.
- **Contact — `definition-list` (serious).** The "by appointment" note was a
  bare text `<div>` directly inside the contact `<dl>`, which only permits
  `<dt>`/`<dd>`/`<div>`-wrapped groups. Moved it out to a `<p>` after the
  list.

Re-ran: 5/5 a11y specs green (Home, Properties, Property detail, Contact,
staff dashboard).

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

### Update — measured against the live Vercel deploy (2026-08-31)

Ran Lighthouse 12 (mobile, simulated throttling) against
`https://k-pearl-agency.vercel.app` after the first successful deploy
(commit `fea7df8`).

| Page | Perf | A11y | Best-practices | SEO | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- | --- |
| / | **76** | 100 | 96 | 100 | 3.1 s | 0.30 | 130 ms |
| /properties | **52** | 100 | 96 | 100 | 6.4 s | 0.37 | 290 ms |
| /about | **74** | 100 | 96 | 100 | 6.7 s | 0.00 | 150 ms |
| /contact | **50** | 100 | 96 | 100 | 7.0 s | 0.30 | 400 ms |

- **Accessibility 100 and SEO 100 on every page** — targets met (≥95 / —).
  The dark-heading fix (`fea7df8`) did not regress a11y.
- **Best-practices 96** — the −4 is the `GET /_vercel/insights/script.js`
  404 console error; **enabling Vercel Web Analytics** on the project should
  clear it.
- **Performance 50–76 — misses the ≥90 target (CLAUDE.md §10).** This is a
  real reading (live infra, not the dev-machine noise the section above
  worried about), and it needs a dedicated pass. Diagnosis from the
  `/contact` trace (worst page):
  - **CLS 0.30–0.37** comes from async content inserted without reserved
    space. Top shift: `<footer>` (score 0.275) — Contact renders its
    `<dl>`/form only after `useSiteSettings` resolves
    (`{settings ? … : null}`), so the page grows and the footer jumps.
    `/about` (all static) has CLS 0. Fix: render the async regions'
    structure with skeleton/placeholder values, or reserve min-heights, so
    layout is stable before data arrives — property grids, the Contact
    details block, filter panels.
  - **LCP 3–7 s** is SPA cold-start: no meaningful paint until `index.js`
    (~85 KB gz) + `vendor-supabase` (~57 KB gz) parse and execute, React
    mounts, data fetches, then the display font swaps. No render-blocking
    CSS/JS was flagged, and only ~90 KB of unused JS — so the lever is
    **loading strategy**, not shaving bytes: dynamically import the Supabase
    client so it's off the public-page critical path; preload the two
    variable fonts and set `font-display: swap`; consider prerendering the
    static shell (a Vite prerender plugin, or Vercel's build output) so the
    hero/`PageHeader` paint from HTML.
  - Total transfer ~1.08 MB; main-thread script eval ~420 ms.

**Recommendation:** a performance tranche (bundle/loading + CLS) before the
≥90 gate can be called met. Tracked in `docs/roadmap.md`.

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

## SEO

Phase 7 tranche 5. Audited the rendered document metadata of every public
route against a running app (local Supabase + `vite`), plus the build
output. Now enforced in CI by `frontend/e2e/seo.spec.ts` (13 checks, part of
`npm run test:e2e`).

### Verified

| Check | Result |
| --- | --- |
| One non-empty `<title>` per route, site-name suffixed | Pass (all 10 public routes) **after a fix**: `index.html` shipped a static `<title>` and `<meta name="description">`, and React 19 only de-dupes among the tags **it** renders — the static ones survived alongside `<Seo>`'s, so every page had **two** of each. Removed both from `index.html` (every route renders `<Seo>` on mount; comment left in `index.html` so they don't get re-added). |
| One non-empty `meta[name=description]` per route | Pass |
| One `link[rel=canonical]`, absolute, query-stripped | Pass — always `https://k-pearl-agency.vercel.app<path>`, so filtered/paged `/properties` URLs still point at the clean canonical |
| Open Graph (`og:title/description/url/image/site_name`) + `twitter:card=summary_large_image` | Pass |
| Filtered / paged property views are `noindex, nofollow` | Pass — `PropertiesPage` sets `noindex` when any filter is active or `page > 1`; the bare `/properties` has no robots tag |
| Property detail JSON-LD | Pass — one `application/ld+json` block, `@type: RealEstateListing`, `provider.name: K Pearl Agency` (`propertyJsonLd`, `src/lib/seo.ts`) |
| `/staff/*` excluded | Pass — `robots.txt` `Disallow: /staff`; `StaffAuthShell` renders `noindex`; sitemap omits staff routes |
| `robots.txt` | Pass — allows all, disallows `/staff`, points at the sitemap |
| `sitemap.xml` (build-time, `scripts/generate-sitemap.mjs`) | Pass — 9 static routes always; published property URLs added when the Supabase REST API is reachable at build (6 from the local seed; 0 in CI without a DB, build still succeeds) |
| `<html lang="en">` | Pass |

### Gaps (not fixed here)

- **Social share image.** As of 2026-09-01 `og:image` / `twitter:image` use
  `/assets/branding/kpearl-icon-512.png` (the 25.b asset kit — a
  self-contained dark square, background-independent). A purpose-built
  1200×630 card is still a nice-to-have.
- **Favicon** now uses the 25.b kit (16/32 + a 180 Apple touch icon). The
  kit is PNG only (no SVG); a WebP/optimiser pass on the larger files is a
  worthwhile follow-up.
- **`*.vercel.app` domain** carries less ranking authority than a custom
  domain; acquiring one is a recommended early post-launch follow-up
  (`docs/deployment.md`).
- **Per-URL `<lastmod>`** is emitted for property URLs but not the static
  routes — acceptable; revisit if crawl freshness becomes a concern.
