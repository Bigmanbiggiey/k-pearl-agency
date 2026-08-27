# K Pearl Agency — Roadmap

## Phase 0 — Product foundation

> Discovery output: **`docs/product-definition.md`** (Product Definition & Requirements
> Baseline) plus proposed ADR-002…ADR-008 in `docs/decisions.md`.
> Status: discovery complete, **awaiting human approval**. The items below are
> recommended in that document but are **not** approved until the business owner
> signs off and the open decisions in §31 are resolved.

- [ ] Confirm business services and exact target areas
- [ ] Confirm property listing types
- [ ] Approve MVP requirements
- [ ] Approve information architecture
- [ ] Approve brand/UI direction
- [ ] Approve staff roles
- [ ] Approve database design

## Phase 1 — Repository foundation
*(in progress — `chore/phase-1-foundation`; all quality gates green locally)*
- [x] Initialize Vite + React + TypeScript
- [x] Configure Tailwind v4
- [x] Configure linting/formatting
- [x] Configure testing
- [x] Configure Supabase client
- [x] Add environment handling
- [x] Add application shell
- [x] Add brand assets *(logo wired; provisional colour tokens pending decision J-3)*
- [ ] Push to a GitHub remote so CI runs
- [ ] Per-route code splitting (moved here from Phase 3 backlog)

## Phase 2 — Supabase foundation
- [ ] Create project
- [ ] Create migrations
- [ ] Create seed data
- [ ] Create RLS policies
- [ ] Configure storage
- [ ] Configure staff auth
- [ ] Generate database types

## Phase 3 — Public website
- [ ] Home
- [ ] About
- [ ] Services
- [ ] Contact
- [ ] Responsive navigation/footer
- [ ] SEO foundations

## Phase 4 — Property catalogue
- [ ] Property list
- [ ] Search
- [ ] Filters
- [ ] Pagination
- [ ] Property detail
- [ ] Gallery
- [ ] Featured properties

## Phase 5 — Lead generation
- [ ] Property enquiry
- [ ] Viewing request
- [ ] General contact form
- [ ] WhatsApp/contact CTAs
- [ ] Success/error states
- [ ] Spam/abuse protections

## Phase 6 — Staff dashboard
- [ ] Staff authentication
- [ ] Dashboard shell
- [ ] Property CRUD
- [ ] Media management
- [ ] Publish/archive
- [ ] Featured/verified controls
- [ ] Enquiry management

## Phase 7 — Quality and launch
- [ ] Unit tests
- [ ] Integration/RLS tests
- [ ] E2E critical flows
- [ ] Lighthouse
- [ ] Accessibility audit
- [ ] SEO audit
- [ ] Security review
- [ ] Production deployment
- [ ] Backup/recovery verification

## Post-MVP candidates

- Favorites
- Saved searches
- Map view
- Agent profiles
- More advanced viewing scheduling
- Property-owner portal
- Analytics
- Notifications
- AI-assisted property discovery

Post-MVP work requires explicit approval.
