# K Pearl Agency — Data/API Contract

K Pearl does not expose a custom REST API in the MVP. The application boundary is a typed Repository/Service contract over Supabase.

## Repository contracts

### PropertyRepository
- `listPublished(filters, pagination)`
- `getBySlug(slug)`
- `getFeatured(limit)`
- `create(input)`
- `update(id, input)`
- `publish(id)`
- `unpublish(id)` — back to `draft`
- `markUnavailable(id)` — temporarily off-market (docs/product-definition.md §9)
- `markLetOrSold(id)` — deal closed
- `archive(id)`
- `setFeatured(id, featured)` — admin only (ADR-007)
- `setVerified(id, verified)` — admin only (ADR-007)
- `listMedia(propertyId)`
- `addMedia(input)`
- `removeMedia(id)`
- `reorderMedia(propertyId, orderedIds)`

The lifecycle methods map to the states in docs/product-definition.md §9:
`draft → published → unavailable | let_or_sold → archived`.

### InquiryRepository
Leads are one table discriminated by `type` (`property_enquiry | general | owner_listing`, docs/product-definition.md §13).
- `create(input)`
- `list(filters, pagination)` — `filters` includes `type`, `status`, `assignedTo`, `propertyId`
- `getById(id)`
- `updateStatus(id, status)` — `new → contacted → in_progress → closed`
- `assign(id, staffId | null)`
- `updateNotes(id, notes)` — internal notes; never exposed to public queries (docs/security.md)

### ViewingRequestRepository
Capture-only (ADR-006); kept as its own table.
- `create(input)`
- `list(filters, pagination)`
- `updateStatus(id, status)` — `new → scheduled → completed → cancelled`
- `updateNotes(id, notes)`

## Service responsibilities

Services:
- validate inputs with Zod;
- normalize user-facing errors;
- enforce domain rules;
- orchestrate multiple repositories when needed.

Repositories:
- contain Supabase queries;
- map database rows to application DTOs;
- never contain UI logic.

## Error model

Use typed application errors such as:
- `VALIDATION_ERROR`
- `NOT_FOUND`
- `UNAUTHORIZED`
- `FORBIDDEN`
- `CONFLICT`
- `DATABASE_ERROR`
- `STORAGE_ERROR`
- `UNKNOWN_ERROR`

Never expose raw database errors to end users.
