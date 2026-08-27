import { z } from 'zod';

/** Kenyan mobile number: +254xxxxxxxxx, 254xxxxxxxxx, or 07xx/01xx + 7 digits. */
export const kenyanPhone = z
  .string()
  .trim()
  .regex(/^(?:\+?254|0)[17]\d{8}$/, 'Enter a valid Kenyan phone number');

/** Optional email that also accepts an empty string from an untouched field. */
export const optionalEmail = z.union([z.email(), z.literal('')]).optional();

export const listingType = z.enum(['rent', 'sale', 'short_let']);
export const propertyType = z.enum([
  'apartment',
  'house',
  'townhouse',
  'maisonette',
  'studio',
  'bedsitter',
  'office',
  'shop',
  'land',
]);
export const preferredContactMethod = z.enum(['phone', 'whatsapp', 'email']);

/** Anti-spam honeypot: a hidden field that must stay empty. */
export const honeypot = z.literal('').optional();
