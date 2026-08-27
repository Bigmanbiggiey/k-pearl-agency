/**
 * Core domain literal unions, locked in by the accepted Phase 0 ADRs
 * (docs/decisions.md ADR-003/006/007) and docs/product-definition.md §9/§13/§14.
 * The persisted enum values in `docs/database.md` must match these strings.
 */

/** ADR-003 — the catalogue covers both rentals and sales. */
export type ListingType = 'rent' | 'sale';

/** docs/product-definition.md §9 — property lifecycle. */
export type PropertyStatus = 'draft' | 'published' | 'unavailable' | 'let_or_sold' | 'archived';

/** ADR-007 — two staff roles for MVP. */
export type StaffRole = 'admin' | 'agent';

/** docs/product-definition.md §13 — one lead table, discriminated by type. */
export type InquiryType = 'property_enquiry' | 'general' | 'owner_listing';

export type InquiryStatus = 'new' | 'contacted' | 'in_progress' | 'closed';

export type PreferredContactMethod = 'phone' | 'whatsapp' | 'email';

/** ADR-006 — capture-only viewing requests. */
export type ViewingRequestStatus = 'new' | 'scheduled' | 'completed' | 'cancelled';
