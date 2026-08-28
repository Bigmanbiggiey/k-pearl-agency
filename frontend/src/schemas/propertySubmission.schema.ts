import { z } from 'zod';

import { honeypot, kenyanPhone, listingType, optionalEmail, propertyType } from './common';

/**
 * "List your property" submission (ADR-009). Public may only create these; they
 * land in the staff review queue and are never auto-published.
 * docs/database.md `property_submissions`.
 */
export const propertySubmissionSchema = z.object({
  submitterName: z.string().trim().min(2).max(120),
  submitterPhone: kenyanPhone,
  submitterEmail: optionalEmail,
  submitterNotes: z.string().trim().max(1000).optional(),

  proposedTitle: z.string().trim().min(4).max(160),
  proposedListingType: listingType,
  proposedPropertyType: propertyType,
  proposedAreaId: z.guid().optional(),
  proposedPrice: z.number().nonnegative().optional(),
  proposedBedrooms: z.number().int().nonnegative().max(50).optional(),
  proposedBathrooms: z.number().nonnegative().max(50).optional(),
  proposedDescription: z.string().trim().max(4000).optional(),

  consent: z.literal(true, { error: 'Please accept the privacy notice to continue' }),
  company: honeypot,
});

export type PropertySubmissionInput = z.infer<typeof propertySubmissionSchema>;
