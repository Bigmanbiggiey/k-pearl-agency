import { AppError } from '@/lib/errors';
import {
  propertyMediaRepository,
  propertyRepository,
  type StaffPropertyFilters,
} from '@/repositories';
import { propertyFormSchema, type PropertyFormValues } from '@/schemas';
import type {
  PropertyMedia,
  PropertyStatus,
  StaffPropertyDetail,
  StaffPropertyListResult,
} from '@/types';

/*
 * Staff property business rules (docs/api-design.md). Slug generation +
 * uniqueness live here; RLS + the `enforce_property_admin_columns` trigger are
 * the real authorization boundary for owner scope and featured/verified.
 */

export interface StaffPropertyContext {
  userId: string;
  isAdmin: boolean;
}

/** Turn a title into a URL-safe slug. */
export function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 120);
  return base || 'listing';
}

async function uniqueSlug(base: string, exceptId?: string): Promise<string> {
  if (!(await propertyRepository.slugExists(base, exceptId))) return base;
  for (let n = 2; n <= 9; n += 1) {
    const candidate = `${base}-${n}`;
    if (!(await propertyRepository.slugExists(candidate, exceptId))) return candidate;
  }
  return `${base}-${crypto.randomUUID().slice(0, 6)}`;
}

function parse(input: unknown): PropertyFormValues {
  const result = propertyFormSchema.safeParse(input);
  if (!result.success) {
    throw new AppError('VALIDATION_ERROR', 'Some property details need fixing.', {
      cause: result.error,
    });
  }
  return result.data;
}

export const staffPropertyService = {
  async create(input: unknown, ctx: StaffPropertyContext): Promise<string> {
    const values = parse(input);
    const guarded: PropertyFormValues = ctx.isAdmin
      ? values
      : { ...values, featured: false, verified: false, agentId: ctx.userId };
    const slug = await uniqueSlug(slugify(guarded.slug || guarded.title));
    return propertyRepository.create(
      { ...guarded, slug },
      { createdBy: ctx.userId, defaultAgentId: ctx.isAdmin ? null : ctx.userId },
    );
  },

  async update(id: string, input: unknown, ctx: StaffPropertyContext): Promise<void> {
    const values = parse(input);
    const slug = await uniqueSlug(slugify(values.slug || values.title), id);
    await propertyRepository.update(id, { ...values, slug }, { canAssignAgent: ctx.isAdmin });
  },

  list(filters: StaffPropertyFilters): Promise<StaffPropertyListResult> {
    return propertyRepository.listForStaff(filters);
  },

  getForStaff(id: string): Promise<StaffPropertyDetail | null> {
    return propertyRepository.getForStaff(id);
  },

  setStatus(id: string, status: PropertyStatus): Promise<void> {
    return propertyRepository.setStatus(id, status);
  },

  setFeatured(id: string, featured: boolean): Promise<void> {
    return propertyRepository.setFeatured(id, featured);
  },

  setVerified(id: string, verified: boolean): Promise<void> {
    return propertyRepository.setVerified(id, verified);
  },

  listMedia(propertyId: string): Promise<PropertyMedia[]> {
    return propertyMediaRepository.list(propertyId);
  },

  uploadMedia(propertyId: string, file: File, altText: string): Promise<PropertyMedia> {
    return propertyMediaRepository.upload(propertyId, file, altText);
  },

  updateMedia(id: string, patch: { altText?: string; isCover?: boolean }): Promise<void> {
    return propertyMediaRepository.update(id, patch);
  },

  removeMedia(id: string): Promise<void> {
    return propertyMediaRepository.remove(id);
  },

  reorderMedia(propertyId: string, orderedIds: string[]): Promise<void> {
    return propertyMediaRepository.reorder(propertyId, orderedIds);
  },
};
