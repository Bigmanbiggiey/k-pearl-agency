/**
 * Core domain literal unions, locked in by the accepted Phase 0 ADRs
 * (docs/decisions.md ADR-003/006/007) and docs/product-definition.md §9/§13/§14.
 * The persisted enum values in `docs/database.md` must match these strings.
 */

/** ADR-003 (amended) — the catalogue covers rentals, sales and short-lets. */
export type ListingType = 'rent' | 'sale' | 'short_let';

/** Rate basis; null for `sale`. */
export type PricePeriod = 'month' | 'night' | 'week';

/** docs/database.md v2.0 — the nine property categories. */
export type PropertyType =
  | 'apartment'
  | 'house'
  | 'townhouse'
  | 'maisonette'
  | 'studio'
  | 'bedsitter'
  | 'office'
  | 'shop'
  | 'land';

/** docs/product-definition.md §9 — property lifecycle. */
export type PropertyStatus = 'draft' | 'published' | 'unavailable' | 'let_or_sold' | 'archived';

/** ADR-007 — two staff roles for MVP. */
export type StaffRole = 'admin' | 'agent';

/**
 * docs/product-definition.md §13 — one lead table, discriminated by type.
 * `owner_listing` moved to `property_submissions` (ADR-009).
 */
export type InquiryType = 'property_enquiry' | 'general';

/** ADR-009 — owner "list your property" submission lifecycle. */
export type PropertySubmissionStatus = 'new' | 'in_review' | 'converted' | 'declined';

export type InquiryStatus = 'new' | 'contacted' | 'in_progress' | 'closed';

export type PreferredContactMethod = 'phone' | 'whatsapp' | 'email';

/** ADR-006 — capture-only viewing requests. */
export type ViewingRequestStatus = 'new' | 'scheduled' | 'completed' | 'cancelled';
