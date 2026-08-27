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

## Component

Critical flows:
- property search
- property filters
- property detail
- enquiry form
- viewing request
- staff property editor

## E2E

Minimum launch journeys:
1. Visitor → Properties → Filter → Detail.
2. Visitor → Detail → Enquiry → Success.
3. Staff → Login → Dashboard → Create property → Publish.
4. Staff → Enquiries → Update status.

## Definition

Tests are part of the feature implementation, not a separate final phase.
