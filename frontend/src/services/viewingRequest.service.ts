import { notImplemented } from '@/lib/errors';

/* Validation + rules for viewing requests (ADR-006). Phase 5. */
export const viewingRequestService = {
  create(_input: unknown): Promise<never> {
    return notImplemented('viewingRequestService.create');
  },
};
