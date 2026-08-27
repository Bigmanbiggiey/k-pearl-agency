# K Pearl Agency — Requirements

> **Phase 0 note (2026-08-27):** `docs/product-definition.md` refines and extends
> this document — notably: catalogue covers **rentals and sales**; **two** staff
> roles (`admin`, `agent`) rather than three; **no public user accounts** in MVP;
> viewing requests are **capture-only**; owner interest is captured as a lead with
> **no owner portal**. Where the two documents differ, `product-definition.md` is the
> current recommendation **pending business approval**. This file is not rewritten
> until that approval lands.

## MVP functional requirements

### FR-01 Public property discovery
Visitors can browse published properties.

### FR-02 Property search
Visitors can search by keyword/location.

### FR-03 Property filtering
Visitors can filter by:
- listing purpose
- property type
- price range
- bedrooms
- location
- availability

Filters should be limited to values actually supported by the database.

### FR-04 Property details
Each published property has:
- title
- gallery
- price
- location
- property type
- key specifications
- description
- amenities
- availability/status
- enquiry CTA

### FR-05 Enquiries
A visitor can submit an enquiry against a property.

Minimum fields:
- name
- phone
- email (optional if phone is provided)
- message
- preferred contact method
- property reference

### FR-06 Viewing request
A visitor can request a viewing. Initial MVP implementation may store the request rather than provide a complex calendar booking system.

### FR-07 Agency pages
Public pages:
- Home
- Properties
- About
- Services
- Contact
- Privacy
- Terms

### FR-08 Staff authentication
Staff access uses Supabase Auth.

### FR-09 Property management
Authorized staff can:
- create
- edit
- publish/unpublish
- archive
- feature
- verify
- manage media

### FR-10 Enquiry management
Staff can view, update status and add internal notes to enquiries.

## Non-functional requirements

- Mobile-first responsive design.
- WCAG-conscious accessible UI.
- SEO-friendly public routes.
- Fast image loading.
- Strict TypeScript.
- RLS on all Supabase tables.
- No secrets in frontend.
- Production build must be reproducible.

## Deliberately out of MVP

- Online rent/payment collection.
- Lease generation.
- Tenant maintenance portal.
- Complex appointment calendar synchronization.
- Public user-generated reviews.
- Peer-to-peer property listing by arbitrary users.
- Dedicated mobile app.
- AI property matching.
