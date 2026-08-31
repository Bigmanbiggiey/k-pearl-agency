# K Pearl Agency — Go-Live Runbook

The ordered, do-this-now steps to put K Pearl Agency into production. Written
in Phase 7 tranche 5. It assumes the build work is done and merged; it does
**not** repeat the "why" — that's in `docs/deployment.md` and
`docs/supabase-setup.md`, which this runbook points into.

Target URLs:

- Frontend: `https://k-pearl-agency.vercel.app` (Vercel free subdomain)
- Backend: hosted Supabase project `k-pearl-agency`
  (ref `nhfrmeicavehrkwqfpgc`)

Two things gate launch and are **not** in this runbook because they're
external:

- **Legal sign-off** — Privacy/Terms are drafts with a visible review banner.
  A lawyer must review them and the owner must complete the DPA 2019 owner
  actions before go-live. See `docs/legal-review.md`.
- **Production content** — real property photography and owner-approved copy
  (`frontend/src/content/*`).

---

## 0. Pre-flight (repo)

- [ ] `feat/quality-launch` merged to `main` via PR.
- [ ] On `main`, from `frontend/`: `npm ci` then all five gates green —
      `npm run typecheck`, `npm run lint`, `npm run format:check`,
      `npm run test`, `npm run build` — plus `npm run test:e2e` (needs a
      local Supabase stack; CI already runs this).
- [ ] `frontend/vercel.json` present (SPA rewrite + security headers +
      asset caching).

---

## 1. Supabase — hosted project

Full detail: `docs/supabase-setup.md` §4–§9. Condensed order:

1. **Confirm schema is current.** From the repo root (CLI already linked):
   ```bash
   npx supabase migration list
   ```
   Local and remote must match (all 14 migrations). If not:
   `npx supabase db push`.

2. **First admin user.** Dashboard → Authentication → Users → Add user
   (email + password). Then SQL Editor:
   ```sql
   update public.profiles
   set role = 'admin', full_name = 'Your Name',
       phone = '+254180558075', whatsapp = '+254180558075'
   where id = (select id from auth.users where email = 'you@example.com');
   ```
   Add the other staff the same way, leaving them `role = 'agent'`.

3. **Auth URL config.** Dashboard → Authentication → URL Configuration:
   - Site URL: `https://k-pearl-agency.vercel.app`
   - Redirect URLs: add `https://k-pearl-agency.vercel.app/**`
   - Authentication → Sign In / Providers → Email: **Enable Signups OFF**.

4. **Edge Functions.** From the repo root:
   ```bash
   npx supabase functions deploy notify-lead
   npx supabase functions deploy invite-staff
   npx supabase secrets set GMAIL_USER=you@gmail.com GMAIL_APP_PASSWORD=xxxxxxxxxxxxxxxx
   ```
   `GMAIL_APP_PASSWORD` is a Google **App Password** (Account → Security →
   2-Step Verification → App passwords), not the account password. Until it's
   set, `notify-lead` logs the email instead of sending — submissions still
   succeed. `invite-staff` needs project SMTP configured for its invite mail
   (Dashboard → Authentication → Providers → Email / SMTP).

5. **Grab the API values** (Dashboard → Project Settings → API), for step 2:
   - Project URL → `VITE_SUPABASE_URL`
   - `anon` / public key → `VITE_SUPABASE_ANON_KEY`
     (safe to expose; RLS is the boundary. Never use `service_role` here.)

---

## 2. Vercel — frontend

1. **New Project** → import the GitHub repo.
2. **Root Directory: `frontend`** (the app is not at the repo root — this is
   why `vercel.json` lives in `frontend/`).
3. Framework preset: **Vite** (auto-detected). Leave Build Command
   (`npm run build`) and Output Directory (`dist`) as detected.
4. **Environment Variables** (Production + Preview):
   | Name | Value |
   | --- | --- |
   | `VITE_SUPABASE_URL` | from step 1.5 |
   | `VITE_SUPABASE_ANON_KEY` | from step 1.5 |
5. **Deploy.**
6. Project → Analytics → enable **Web Analytics** (the app already mounts
   `@vercel/analytics`; this turns on collection).

---

## 3. Post-deploy smoke test

Against `https://k-pearl-agency.vercel.app`:

- [ ] Home page renders; no console errors.
- [ ] **Deep link works:** open
      `…/properties/<some-slug>` in a fresh tab and hard-refresh — it must
      load, not 404. (Proves the `vercel.json` rewrite.) If it 404s, the
      Root Directory or the rewrite is wrong.
- [ ] Submit a test enquiry from the Contact page → success message; a row
      appears in `inquiries`; `notify-lead` logs or sends (Supabase →
      Edge Functions → Logs).
- [ ] Staff sign-in at `/staff/login` with the admin user → dashboard tiles
      load with real counts.
- [ ] `…/robots.txt` and `…/sitemap.xml` load and show the production URL.
- [ ] Headers present:
      ```bash
      curl -sI https://k-pearl-agency.vercel.app | grep -iE 'x-content-type-options|x-frame-options|referrer-policy|strict-transport-security|permissions-policy'
      ```
- [ ] Delete the test enquiry row.

---

## 4. Post-deploy: verify the two deferred audits

- [ ] **Legal** — only lift the review banner
      (`LEGAL_REVIEW_BANNER` / `LEGAL_EFFECTIVE` in
      `frontend/src/content/legal.ts`) once a lawyer has signed the copy off
      and the `docs/legal-review.md` §5 gate is complete.
- [ ] **Backup posture** — do the recovery drill in
      `docs/backup-recovery.md` once and record the date there.

---

## 5. Post-deploy: real Lighthouse

`npm run audit:lighthouse` runs against a **local** `vite preview` and the
numbers on a busy dev machine are unreliable (see `docs/launch-audit.md`
§Performance). Do the real check against the deploy:

```bash
npx lighthouse https://k-pearl-agency.vercel.app/ --only-categories=performance,accessibility,seo,best-practices --form-factor=mobile --view
```

Repeat for `/properties`, a `/properties/<slug>`, and `/contact`. Or use
PageSpeed Insights (pagespeed.web.dev) for a clean-room run.

Targets (CLAUDE.md §10): **Performance ≥90**, **Accessibility ≥95**. Record
the results in `docs/launch-audit.md` §Performance and flip that section's
`[~]` to a real reading. If Performance is under 90, the usual first
suspects for this stack: the `vendor-supabase` chunk (~217 KB / 57 KB gzip)
on routes that don't need auth, and unoptimised property images uploaded via
the admin panel.

---

## 6. Deferred (post-launch, not blocking)

- **Custom domain** (`.co.ke` / `.com`) — recommended early: better ranking
  authority than `*.vercel.app` and needed for a branded email sender. Add in
  Vercel → Domains, then update `SITE_URL` in `frontend/src/lib/seo.ts`, the
  sitemap `SITE_URL`, `robots.txt`, and the Supabase auth URLs.
- **WhatsApp lead alerts** — needs Meta Business verification for
  +254704061324; `whatsappSender` is a stub (ADR-010). Launch ships email +
  in-dashboard alerts only.
- **Social share image + favicon** — 1200×630 OG card and a small favicon /
  Apple touch icon (designer handoff, decision 25.b). Until then, wire the
  path into `Seo.tsx`'s `imageUrl` fallback.
- **Content-Security-Policy header** — add to `vercel.json` once there's a
  live deploy to test it against (needs `self` + the Supabase project origin
  + Google Fonts + Vercel analytics; verify nothing breaks in production).
- **Supabase plan** — Free pauses after ~1 week idle and has no PITR;
  move to Pro before real launch (`docs/backup-recovery.md`).
