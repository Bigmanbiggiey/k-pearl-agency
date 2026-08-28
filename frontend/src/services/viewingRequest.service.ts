import { AppError } from '@/lib/errors';
import { viewingRequestRepository, type CreateViewingRequestInput } from '@/repositories';
import { viewingRequestSchema, type ViewingRequestInput } from '@/schemas';

export const viewingRequestService = {
  async create(input: ViewingRequestInput): Promise<void> {
    const parsed = viewingRequestSchema.safeParse(input);
    if (!parsed.success) {
      throw new AppError('VALIDATION_ERROR', 'Please check the form and try again.', {
        cause: parsed.error,
      });
    }
    const v = parsed.data;
    if (v.company && v.company.length > 0) return; // honeypot

    const payload: CreateViewingRequestInput = {
      propertyId: v.propertyId,
      name: v.name,
      phone: v.phone,
      email: v.email || null,
      preferredDate: v.preferredDate ?? null,
      preferredTime: v.preferredTime ?? null,
      message: v.message ?? null,
    };
    await viewingRequestRepository.create(payload);
  },
};
