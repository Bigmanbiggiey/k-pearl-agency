# K Pearl Agency — Architecture

## 1. Overview

K Pearl uses a frontend-first architecture backed directly by Supabase services.

```text
Browser
  ↓
React + TypeScript + Vite
  ↓
Pages / Features / Hooks
  ↓
Services
  ↓
Repositories
  ↓
Supabase JS
  ├── Auth
  ├── Postgres
  ├── Storage
  ├── Realtime (only where justified)
  └── Edge Functions (only for privileged/server-side workflows)
```

There is no Django or standalone application server.

## 2. Frontend structure

Feature-oriented organization is preferred.

- `pages/` route-level screens.
- `features/` user-facing workflows.
- `entities/` reusable domain concepts.
- `components/` shared UI and layout.
- `hooks/` reusable state/orchestration.
- `services/` business logic.
- `repositories/` Supabase access.
- `schemas/` Zod validation.
- `lib/` cross-cutting utilities.
- `types/` shared application types.

## 3. Data flow

A property search should look like:

`PropertySearchPage → useProperties() → propertyService.search() → propertyRepository.search() → Supabase`

A property enquiry:

`PropertyEnquiryForm → useCreateInquiry() → inquiryService.create() → inquiryRepository.create() → Supabase`

Components must not call Supabase directly.

## 4. Public vs staff application

The same React application may host:
- public routes under `/`
- staff routes under `/staff`

The staff area has its own authenticated shell.

Authorization is enforced by Supabase RLS.

## 5. Supabase responsibilities

Postgres:
- properties
- property media metadata
- enquiries
- profiles/staff roles
- service/content records where needed

Auth:
- staff authentication
- optional public user authentication for favorites

Storage:
- property media
- agency assets if needed

Edge Functions:
- privileged workflows
- integrations requiring secrets
- notifications where needed

Do not create an Edge Function merely to wrap a simple public Postgres query.

## 6. SEO

Public property detail pages must have stable, readable slugs.

Use route-level metadata and structured content.

If the project later requires SSR/SSG for SEO, document the architectural change before migrating away from Vite SPA. MVP should remain Vite unless an SEO requirement makes the tradeoff necessary.

## 7. Error handling

Repositories normalize Supabase/database errors into application-level errors.

Services handle domain validation.

UI handles:
- loading
- empty
- error
- success
states explicitly.
