import { AppError } from '@/lib/errors';
import { propertySubmissionRepository, type CreatePropertySubmissionInput } from '@/repositories';
import { propertySubmissionSchema, type PropertySubmissionInput } from '@/schemas';

export const propertySubmissionService = {
  async create(input: PropertySubmissionInput): Promise<void> {
    const parsed = propertySubmissionSchema.safeParse(input);
    if (!parsed.success) {
      throw new AppError('VALIDATION_ERROR', 'Please check the form and try again.', {
        cause: parsed.error,
      });
    }
    const v = parsed.data;
    if (v.company && v.company.length > 0) return; // honeypot

    const payload: CreatePropertySubmissionInput = {
      submitterName: v.submitterName,
      submitterPhone: v.submitterPhone,
      submitterEmail: v.submitterEmail || null,
      submitterNotes: v.submitterNotes ?? null,
      proposedTitle: v.proposedTitle,
      proposedListingType: v.proposedListingType,
      proposedPropertyType: v.proposedPropertyType,
      proposedAreaId: v.proposedAreaId ?? null,
      proposedPrice: v.proposedPrice ?? null,
      proposedBedrooms: v.proposedBedrooms ?? null,
      proposedBathrooms: v.proposedBathrooms ?? null,
      proposedDescription: v.proposedDescription ?? null,
    };
    await propertySubmissionRepository.create(payload);
  },
};
