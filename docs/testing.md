# K Pearl Agency — Testing Strategy

## Unit

Test:
- Zod schemas
- formatters
- price/display utilities
- search/filter transformations
- service business rules

## Integration

Use a real local Supabase environment for:
- repository behavior
- RLS
- property visibility
- staff permissions
- enquiry insertion rules

`*.integration.test.ts` (`frontend/src/test/`) self-skip via
`describe.skipIf(!ok)` when the local stack isn't reachable — CI now starts
one (`.github/workflows/ci.yml`, ADR-013), so this suite runs for real there,
not just on a developer's own `supabase start` session.

## Component

Critical flows:
- property search
- property filters
- property detail
- enquiry form
- viewing request
- staff property editor

## E2E

**Implemented** — Playwright (`frontend/e2e/`, `playwright.config.ts`,
ADR-013), run via `npm run test:e2e` (needs a local Supabase stack:
`supabase start` + `db reset`). Drives the Vite dev server directly, no
build required first. Wired into CI after the unit/integration suite.

Minimum launch journeys:
1. Visitor → Properties → Filter → Detail — `e2e/search-to-detail.spec.ts`.
2. Visitor → Detail → Enquiry → Success — `e2e/enquiry.spec.ts`.
3. Staff → Login → Dashboard → Create property → Publish —
   `e2e/staff-property.spec.ts`.
4. Staff → Enquiries → Update status — `e2e/staff-enquiries.spec.ts`.

Staff journeys sign in as the seeded local dev admin
(`supabase/seed/seed.sql`) — local/CI only, never production.

## Definition

Tests are part of the feature implementation, not a separate final phase.
