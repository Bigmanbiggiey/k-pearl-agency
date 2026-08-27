import { notImplemented } from '@/lib/errors';

/* Validation + rules for lead capture. Phase 5. */
export const inquiryService = {
  create(_input: unknown): Promise<never> {
    return notImplemented('inquiryService.create');
  },
  updateStatus(_id: string, _status: unknown): Promise<never> {
    return notImplemented('inquiryService.updateStatus');
  },
};
