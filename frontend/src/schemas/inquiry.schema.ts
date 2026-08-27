import { z } from 'zod';

import { honeypot, kenyanPhone, optionalEmail, preferredContactMethod } from './common';

/** Property enquiry / general contact form. docs/database.md `inquiries`. */
export const inquirySchema = z
  .object({
    type: z.enum(['property_enquiry', 'general']),
    propertyId: z.uuid().optional(),
    name: z.string().trim().min(2).max(120),
    phone: kenyanPhone,
    email: optionalEmail,
    message: z.string().trim().min(10).max(2000),
    preferredContactMethod,
    consent: z.literal(true, { error: 'Please accept the privacy notice to continue' }),
    company: honeypot,
  })
  .refine((v) => v.type === 'general' || Boolean(v.propertyId), {
    error: 'A property reference is required for a property enquiry',
    path: ['propertyId'],
  });

export type InquiryInput = z.infer<typeof inquirySchema>;
