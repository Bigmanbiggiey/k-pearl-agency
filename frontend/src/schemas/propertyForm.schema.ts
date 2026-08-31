import { z } from 'zod';

import { listingType, propertyType } from './common';

/**
 * Staff create/update form for a property (docs/database.md v2.0). Numeric and
 * optional text fields are modelled as `null` (not `undefined`) because the
 * editor always renders every control; `setValueAs` maps empty inputs to `null`.
 */

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const propertyStatusSchema = z.enum([
  'draft',
  'published',
  'unavailable',
  'let_or_sold',
  'archived',
]);

export const pricePeriodSchema = z.enum(['month', 'night', 'week']);
export const sizeUnitSchema = z.enum(['sqm', 'sqft', 'acre', 'ha']);

export const propertyFormSchema = z
  .object({
    title: z.string().trim().min(4, 'Give the listing a clear title').max(160),
    // Empty means "generate from the title" (handled in staffPropertyService).
    slug: z.union([
      z.literal(''),
      z
        .string()
        .trim()
        .min(3, 'Slug is too short')
        .max(160)
        .regex(SLUG_RE, 'Lowercase letters, numbers and single hyphens only'),
    ]),
    listingType,
    pricePeriod: pricePeriodSchema.nullable(),
    propertyType,
    priceOnRequest: z.boolean(),
    price: z.number().nonnegative('Price cannot be negative').max(100_000_000_000).nullable(),
    currency: z.literal('KES'),
    areaId: z.guid().nullable(),
    bedrooms: z.number().int().min(0).max(50).nullable(),
    bathrooms: z.number().min(0).max(50).nullable(),
    sizeValue: z.number().positive().max(1_000_000).nullable(),
    sizeUnit: sizeUnitSchema.nullable(),
    description: z.string().trim().max(6000),
    amenities: z.array(z.string()),
    availableFrom: z.union([z.iso.date(), z.literal('')]),

    // Location & owner — staff-only columns
    addressLine: z.string().trim().max(240),
    latitude: z.number().min(-90).max(90).nullable(),
    longitude: z.number().min(-180).max(180).nullable(),
    ownerName: z.string().trim().max(160),
    ownerPhone: z.string().trim().max(40),
    ownerEmail: z.union([z.email('Enter a valid email'), z.literal('')]),

    // Publishing
    status: propertyStatusSchema,
    agentId: z.guid().nullable(),
    featured: z.boolean(),
    verified: z.boolean(),
  })
  .refine((v) => v.listingType !== 'sale' || v.pricePeriod === null, {
    path: ['pricePeriod'],
    message: 'A sale listing has no rate period',
  })
  .refine((v) => v.priceOnRequest || v.price !== null, {
    path: ['price'],
    message: 'Enter a price, or mark it as “price on request”',
  })
  .refine((v) => (v.sizeValue === null) === (v.sizeUnit === null), {
    path: ['sizeUnit'],
    message: 'Set both a size and a unit, or neither',
  });

export type PropertyFormValues = z.infer<typeof propertyFormSchema>;
