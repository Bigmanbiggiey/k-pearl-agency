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

Covered separately in tranche 3.
