import { z } from 'zod';

import { honeypot, kenyanPhone, optionalEmail } from './common';

/** Viewing request form (capture-only, ADR-006). docs/database.md `viewing_requests`. */
export const viewingRequestSchema = z.object({
  propertyId: z.uuid(),
  name: z.string().trim().min(2).max(120),
  phone: kenyanPhone,
  email: optionalEmail,
  preferredDate: z.iso.date().optional(),
  preferredTime: z.enum(['morning', 'afternoon', 'evening']).optional(),
  message: z.string().trim().max(1000).optional(),
  consent: z.literal(true, { error: 'Please accept the privacy notice to continue' }),
  company: honeypot,
});

export type ViewingRequestInput = z.infer<typeof viewingRequestSchema>;
