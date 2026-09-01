# K Pearl Agency — Project Structure

Legend: `✓` exists as of Phase 1; unmarked entries are planned for later phases.

```text
k-pearl-agency/
├── CLAUDE.md                         ✓
├── README.md                         ✓
├── package.json                      ✓  workspace root; delegates to frontend/
├── package-lock.json                    (Phase 2 — root install for supabase CLI)
├── .gitignore                        ✓
├── .gitattributes                    ✓  LF normalisation
├── .env.example                     ✓
├── .github/
│   └── workflows/
│       └── ci.yml                    ✓  typecheck → lint → format:check → test → build (Node 24)
├── docs/
│   ├── vision.md                     ✓
│   ├── requirements.md               ✓
│   ├── user-stories.md               ✓
│   ├── architecture.md               ✓
│   ├── database.md                   ✓
│   ├── database-readiness.md         ✓
│   ├── api-design.md                 ✓
│   ├── ui-guidelines.md              ✓
│   ├── branding.md                   ✓
│   ├── coding-standards.md           ✓
│   ├── roadmap.md                    ✓
│   ├── decisions.md                  ✓  ADR-001 … ADR-008
│   ├── security.md                   ✓
│   ├── testing.md                    ✓
│   ├── deployment.md                 ✓
│   ├── content-plan.md               ✓
│   ├── product-definition.md         ✓  Phase 0 baseline
│   ├── phase-0-decision-register.md  ✓
│   ├── business-owner-questionnaire.md ✓
│   ├── project-structure.md          ✓
│   └── project-state.md              ✓
├── frontend/
│   ├── index.html                    ✓
│   ├── package.json                  ✓  exact-pinned deps
│   ├── package-lock.json             ✓
│   ├── .nvmrc                        ✓  24
│   ├── tsconfig.json                 ✓  strict
│   ├── vite.config.ts                ✓  React + Tailwind v4 plugins; inline Vitest config
│   ├── eslint.config.js              ✓  flat config
│   ├── .prettierrc / .prettierignore ✓
│   ├── scripts/generate-sitemap.mjs  ✓  build-time sitemap (ADR-011)
│   ├── public/
│   │   ├── robots.txt                ✓
│   │   └── assets/branding/       ✓  25.b asset kit — kpearl-mark, favicon 16/32/180, kpearl-icon-512, lockups; k-pearl-logo.png (original, unused)
│   └── src/
│       ├── main.tsx                  ✓  entry; StrictMode; env; fonts; styles
│       ├── vite-env.d.ts             ✓  typed import.meta.env
│       ├── app/                      ✓  App.tsx (+ <Analytics/>), router.tsx (lazy), queryClient.ts
│       ├── components/
│       │   ├── layout/               ✓  Header (+drawer), Footer, PublicLayout, StaffLayout (role nav, RequireStaff), RouteFallback
│       │   ├── ui/                   ✓  Button/ButtonLink/ButtonAnchor, Card, Badge, Container, Section, PageHeader, Prose
│       │   ├── property/             ✓  PropertyCard, PropertyGrid, PropertyImage, PropertyGallery, HeroSearch
│       │   ├── Seo.tsx               ✓  React 19 metadata + JSON-LD
│       │   └── RootErrorBoundary.tsx ✓
│       ├── content/                  ✓  site, home, services, about, legal (draft copy; no CMS)
│       ├── pages/
│       │   ├── PagePlaceholder.tsx   ✓  shared stub (Phase 4/5/6 pages)
│       │   ├── public/               ✓  Home, Properties*, PropertyDetail, Services, About,
│       │   │                            Contact, Areas, ListYourProperty*, Privacy, Terms, NotFound
│       │   └── admin/                ✓  Staff{Login,Forgot,Reset,Dashboard,Properties,PropertyEditor,Submissions,Enquiries,Viewings,Settings,Team}Page, StaffAuthShell
│       ├── repositories/             ✓  property (+staff), propertyMedia, area, siteSettings, inquiry, viewingRequest, propertySubmission, auth, profile, staff
│       ├── services/                 ✓  property, inquiry, viewingRequest, propertySubmission, staffProperty, staffLeads
│       ├── features/
│       │   ├── auth/                 ✓  AuthContext, AuthProvider, useAuth, RequireStaff/RequireAdmin
│       │   ├── staff/                ✓  hooks, leadHooks, settingsHooks, coerce, ui/ (StatTile, StatusBadge, SaveBar, MediaManager, ConfirmButton, EmptyState, TableScroll)
│       │   ├── property-search/      ✓  filterParams, usePropertyFilters, PropertyFilters, ActiveFilterChips, SortSelect, Pagination, FiltersSheet
│       │   └── lead-forms/           ✓  EnquiryForm, ViewingRequestForm, ListPropertyForm, LeadDialog, useLeadSubmit, Honeypot, ConsentField
│       ├── hooks/                    ✓  useSiteSettings, useAreas, useProperties/Featured/Latest/Property, useDebouncedCallback, useCreate{Inquiry,ViewingRequest,PropertySubmission}
│       ├── lib/                      ✓  env, supabase, errors, queryKeys, seo, format, media, contact
│       ├── schemas/                  ✓  common, propertySearch (+ fields), inquiry, viewingRequest, propertySubmission, auth, propertyForm, staffSettings
│       ├── types/                    ✓  domain, property, lead, siteSettings, database.types (generated), index
│       ├── styles/                   ✓  index.css — Tailwind v4 @theme + Fraunces/Inter
│       ├── test/                     ✓  setup, utils, smoke, *.integration.test
│       ├── entities/                    (still unused — feature domain concepts, later)
│       └── assets/                      component-imported assets (as needed)
├── supabase/
│   ├── migrations/                      (Phase 2 — after docs/database.md is approved)
│   ├── functions/                       notify-lead (Phase 5), invite-staff (Phase 6)
│   └── seed/                            (Phase 2)
└── tasks/
    └── phase-0.md                    ✓
```

## Conventions

- Feature-oriented organisation (docs/architecture.md §2).
- Data flow: `Page → Hook → Service → Repository → Supabase`. Components never
  import Supabase — enforced by the `no-restricted-imports` ESLint rule, which
  permits `@supabase/supabase-js` only in `src/lib/supabase.ts` and
  `@/lib/supabase` only in `src/repositories/**`.
- Naming per docs/coding-standards.md: `PascalCase.tsx` components,
  `something.service.ts`, `something.repository.ts`, `*.test.tsx` tests.
- Path alias `@/*` → `src/*`.
