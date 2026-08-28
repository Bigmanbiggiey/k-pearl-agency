import { AppError, notImplemented } from '@/lib/errors';
import { inquiryRepository, type CreateInquiryInput } from '@/repositories';
import { inquirySchema, type InquiryInput } from '@/schemas';

export const inquiryService = {
  async create(input: InquiryInput): Promise<void> {
    const parsed = inquirySchema.safeParse(input);
    if (!parsed.success) {
      throw new AppError('VALIDATION_ERROR', 'Please check the form and try again.', {
        cause: parsed.error,
      });
    }
    const v = parsed.data;
    if (v.company && v.company.length > 0) return; // honeypot — silently accept

    const payload: CreateInquiryInput = {
      type: v.type,
      propertyId: v.propertyId ?? null,
      name: v.name,
      phone: v.phone,
      email: v.email || null,
      message: v.message,
      preferredContactMethod: v.preferredContactMethod,
    };
    await inquiryRepository.create(payload);
  },

  updateStatus(_id: string, _status: unknown): Promise<never> {
    return notImplemented('inquiryService.updateStatus');
  },
};
