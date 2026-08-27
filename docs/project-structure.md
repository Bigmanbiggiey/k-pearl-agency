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
│   ├── public/
│   │   └── assets/branding/k-pearl-logo.png  ✓
│   └── src/
│       ├── main.tsx                  ✓  entry; StrictMode; fail-fast env
│       ├── vite-env.d.ts             ✓  typed import.meta.env
│       ├── app/                      ✓  App.tsx, router.tsx, queryClient.ts
│       ├── components/
│       │   ├── layout/               ✓  Header, Footer, PublicLayout, StaffLayout, StaffAuthGuard
│       │   ├── ui/                   ✓  Button, Card, Badge, Container
│       │   └── RootErrorBoundary.tsx ✓
│       ├── pages/
│       │   ├── PagePlaceholder.tsx   ✓  shared Phase-1 stub
│       │   ├── public/               ✓  Home, Properties, PropertyDetail, Services, About,
│       │   │                            Contact, ListYourProperty, Privacy, Terms, NotFound
│       │   └── admin/                ✓  StaffDashboard, StaffLogin
│       ├── repositories/             ✓  property / inquiry / viewingRequest (stubs)
│       ├── services/                 ✓  property / inquiry / viewingRequest (stubs)
│       ├── lib/                      ✓  env, supabase, errors, queryKeys
│       ├── hooks/                    ✓  barrel only (populated per feature, Phase 3+)
│       ├── schemas/                  ✓  barrel only (populated per feature)
│       ├── types/                    ✓  domain.ts, database.types.ts (placeholder), index.ts
│       ├── styles/                   ✓  index.css — Tailwind v4 + @theme brand tokens
│       ├── test/                     ✓  setup.ts, smoke.test.tsx
│       ├── entities/                    property/, agency/  (Phase 3+)
│       ├── features/                    property-search/, property-inquiry/, auth/, admin/ (Phase 3+)
│       └── assets/                      component-imported assets (as needed)
├── supabase/
│   ├── migrations/                      (Phase 2 — after docs/database.md is approved)
│   ├── functions/                       (notify-lead — SHOULD-HAVE, Phase 5)
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
