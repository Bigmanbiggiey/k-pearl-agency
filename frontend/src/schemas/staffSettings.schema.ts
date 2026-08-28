import { z } from 'zod';

import { kenyanPhone } from './common';

/** Admin settings + team forms (docs/database.md site_settings, areas, profiles). */

export const siteSettingsSchema = z.object({
  phone: kenyanPhone,
  whatsapp: kenyanPhone,
  email: z.email('Enter a valid email'),
  hoursWeekday: z.string().trim().min(1, 'Required').max(120),
  hoursWeekend: z.string().trim().min(1, 'Required').max(120),
  byAppointment: z.boolean(),
});
export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;

export const areaFormSchema = z.object({
  county: z.string().trim().min(2).max(80),
  name: z.string().trim().min(2).max(80),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Lowercase letters, numbers and single hyphens only'),
  sortOrder: z.number().int().min(0).max(9999),
});
export type AreaFormInput = z.infer<typeof areaFormSchema>;

export const inviteStaffSchema = z.object({
  email: z.email('Enter a valid email'),
  fullName: z.string().trim().min(2, 'Required').max(120),
  role: z.enum(['admin', 'agent']),
});
export type InviteStaffInput = z.infer<typeof inviteStaffSchema>;

export const profileEditSchema = z.object({
  fullName: z.string().trim().min(2, 'Required').max(120),
  phone: z.union([kenyanPhone, z.literal('')]),
  whatsapp: z.union([kenyanPhone, z.literal('')]),
});
export type ProfileEditInput = z.infer<typeof profileEditSchema>;
