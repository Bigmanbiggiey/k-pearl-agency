# K Pearl Agency — Coding Standards

## General

- TypeScript strict mode.
- No `any`.
- Prefer small, composable functions.
- Keep components presentation-focused.
- Avoid premature abstractions.
- Do not add dependencies without a concrete need.

## Naming

- Components: `PascalCase.tsx`
- Hooks: `useSomething.ts`
- Services: `something.service.ts`
- Repositories: `something.repository.ts`
- Schemas: `something.schema.ts`
- Types: `something.types.ts`
- Tests: colocated or `*.test.ts(x)`

## React

- Prefer function components.
- Keep effects minimal.
- Do not fetch data directly in components.
- Use TanStack Query for server state where appropriate.
- Keep URL/search state in the URL when it represents shareable filters.

## Tailwind

- Mobile-first.
- Prefer project tokens over arbitrary repeated values.
- Do not create long class strings when a reusable component is justified.
- Avoid inline styles unless technically necessary.

## Supabase

- Supabase access only through repositories.
- Every write is validated by Zod.
- Every table has RLS.
- Never use service-role keys in frontend code.

## Git

Use Conventional Commits and short-lived feature branches.

## Review checklist

Before completion:
- typecheck
- lint
- tests
- build
- responsive check
- accessibility check
- RLS/security review
- docs updated
