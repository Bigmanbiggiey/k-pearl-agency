import { notImplemented } from '@/lib/errors';
import type { InquiryStatus, InquiryType } from '@/types';

/* Data access for leads (property enquiry / general / owner listing). Phase 2. */

export interface InquiryListFilters {
  type?: InquiryType;
  status?: InquiryStatus;
  assignedTo?: string;
  propertyId?: string;
}

export const inquiryRepository = {
  create(_input: unknown): Promise<never> {
    return notImplemented('inquiryRepository.create');
  },
  list(_filters: InquiryListFilters): Promise<never> {
    return notImplemented('inquiryRepository.list');
  },
  getById(_id: string): Promise<never> {
    return notImplemented('inquiryRepository.getById');
  },
  updateStatus(_id: string, _status: InquiryStatus): Promise<never> {
    return notImplemented('inquiryRepository.updateStatus');
  },
  assign(_id: string, _staffId: string | null): Promise<never> {
    return notImplemented('inquiryRepository.assign');
  },
  updateNotes(_id: string, _notes: string): Promise<never> {
    return notImplemented('inquiryRepository.updateNotes');
  },
};
