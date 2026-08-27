# K Pearl Agency — Claude Code Operating Manual

> Version: 0.1.0
> Status: Project foundation
> Scope: Root operating manual for Claude Code and human contributors.

## 1. Mission

Build a polished, trustworthy, mobile-first digital presence for K Pearl Agency that makes it easy for prospective tenants, buyers, landlords, and property owners to discover available properties and contact the agency.

The website should feel like a premium Kenyan property agency — not a generic property marketplace and not a clone of Rental Hunt.

The existing Rental Hunt KE repository is the architectural reference point. It already uses React 19, TypeScript, Vite, React Router, Tailwind CSS v4 and Supabase with PostgreSQL/Auth/Storage/Realtime/Edge Functions, plus documentation-driven development. K Pearl should reuse the proven engineering discipline while adapting the product and visual identity to K Pearl Agency. See the source reference: https://github.com/Bigmanbiggiey/rental-hunt

## 2. Non-negotiable architecture

- Frontend: React + TypeScript + Vite.
- Styling: Tailwind CSS v4.
- Backend platform: Supabase only.
- Database: Supabase PostgreSQL.
- Authentication: Supabase Auth.
- Media: Supabase Storage.
- Authorization: PostgreSQL Row Level Security.
- Server-side privileged work: Supabase Edge Functions only when genuinely required.
- No Django.
- No Express/Node API server.
- No direct database access from arbitrary frontend code; use repositories/services.
- Never expose a Supabase service-role key to the browser.
- Keep the architecture simple until a real requirement justifies complexity.

## 3. Product direction

K Pearl Agency is an agency website with a property-discovery engine.

Primary audiences:
1. Property seekers — tenants and buyers.
2. Property owners / landlords seeking agency services.
3. Corporate or institutional clients.
4. K Pearl staff/admin users.

Core public experience:
- Home
- Property search
- Property detail
- About K Pearl
- Services
- Contact
- Property enquiry / viewing request
- Optional favorites for authenticated users

Agency/admin experience:
- Secure staff login
- Dashboard
- Property CRUD
- Property media management
- Inquiry management
- Featured property management
- Basic site/content settings

Do not implement marketplace features such as tenant-to-landlord direct accounts, public reviews, payments, leases, or complex booking unless explicitly added to the approved requirements.

## 4. Documentation-first workflow

Every development session:

1. Read `docs/project-state.md`.
2. Read the active sprint in `docs/roadmap.md`.
3. Identify the next approved task.
4. Read the relevant requirements, user stories, architecture, database, API/service and UI documentation.
5. Write a short implementation plan before non-trivial changes.
6. Implement incrementally.
7. Run lint, typecheck, tests and build.
8. Update documentation in the same change when architecture/data/UI decisions changed.
9. Update `docs/project-state.md`.
10. State the next recommended task.

Never redesign the architecture silently.

## 5. Coding workflow

Requirements → Architecture → Database → Repository contract → Service/schema → UI → Tests → Documentation.

The UI must not contain Supabase queries.

Preferred chain:

Page/Component
→ Hook
→ Service
→ Repository
→ Supabase

Repositories own data access and error normalization.
Services own business rules and validation.
Hooks own client/server state orchestration.
Components focus on presentation and interaction.

## 6. TypeScript rules

- Strict TypeScript.
- No `any`.
- Prefer discriminated unions and string literal unions.
- Validate external/user input with Zod.
- Generated/database types should be treated as the source of truth for persistence.
- Do not duplicate database shapes casually in UI components.
- Use explicit return types for important service/repository functions.

## 7. Supabase security

- RLS enabled on every application table.
- Public users may read only records explicitly marked public/active.
- Staff operations require authenticated staff roles.
- Staff authorization must be enforced by RLS, not merely hidden UI.
- Public enquiry creation must allow only the minimum fields required.
- Storage buckets must have deliberate read/write policies.
- Service-role credentials belong only in Supabase Edge Functions/server-side environments.
- Never commit secrets.

## 8. UI rules

K Pearl branding is premium black + gold.

The supplied logo is stored at:
`frontend/public/assets/branding/k-pearl-logo.png`

Brand direction:
- Primary: near-black / black.
- Accent: warm metallic gold.
- Supporting neutrals: ivory/white, charcoal and muted gray.
- Avoid excessive gradients, glowing effects or visual clutter.
- Use gold as an accent, not as a full-page background.
- Typography should feel elegant and premium while remaining highly readable.
- Property photography is a major visual element.
- Mobile-first.
- Accessibility is part of implementation, not a later pass.

Brand wording visible in the supplied logo:
“K.pearl Agency”
“MARKETING REAL ESTATE, CREATING VALUE”

Do not invent a different official tagline without approval.

## 9. Property data principles

Properties need structured data, not one giant description field.

Expected concepts include:
- title
- slug
- listing type
- property type
- status
- price
- currency
- location
- bedrooms
- bathrooms
- size
- description
- amenities
- featured flag
- verified flag
- availability
- media
- published timestamps

Exact schema is controlled by `docs/database.md`.

## 10. Performance

- Lazy-load routes where appropriate.
- Optimize property images.
- Avoid loading full-resolution gallery images in cards.
- Paginate property feeds.
- Query only fields required by each screen.
- Avoid unnecessary realtime subscriptions.
- Keep dependencies lean.
- Target Lighthouse Performance ≥90 and Accessibility ≥95 at launch.

## 11. Testing

Minimum expectations:
- Unit tests for utilities, schemas and service rules.
- Repository integration tests for important RLS behavior.
- Component tests for critical public flows.
- End-to-end coverage for search → detail → enquiry and staff property management before launch.
- Every acceptance criterion is manually verified.

## 12. Git

Branches:
- `feature/<slug>`
- `fix/<slug>`
- `chore/<slug>`
- `docs/<slug>`

Conventional commits:
- `feat:`
- `fix:`
- `refactor:`
- `docs:`
- `test:`
- `chore:`
- `perf:`
- `style:`

One logical change per commit.

## 13. Definition of Done

A task is complete only when:
- Acceptance criteria pass.
- TypeScript is clean.
- ESLint is clean.
- Tests pass.
- Production build succeeds.
- Responsive behavior is verified.
- Accessibility is verified.
- Security/RLS implications are verified.
- Required documentation is updated.
- No known regression is introduced.

## 14. Scope control

If a requested feature is outside the active roadmap:
- identify it as scope creep;
- explain where it belongs;
- do not implement it silently.

If two approved documents conflict, stop and request a decision.

If a better architecture is discovered, propose it before changing the approved architecture.

## 15. Current project status

This repository is a documentation and structural foundation. No production feature implementation is assumed complete.

Start by validating the approved requirements and database design before building application screens.
