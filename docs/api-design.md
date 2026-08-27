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
- `archive(id)`
- `setFeatured(id, featured)`
- `setVerified(id, verified)`
- `listMedia(propertyId)`
- `addMedia(input)`
- `removeMedia(id)`
- `reorderMedia(propertyId, orderedIds)`

### InquiryRepository
- `create(input)`
- `list(filters, pagination)`
- `getById(id)`
- `updateStatus(id, status)`
- `updateNotes(id, notes)`

### ViewingRequestRepository
- `create(input)`
- `list(filters, pagination)`
- `updateStatus(id, status)`

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
