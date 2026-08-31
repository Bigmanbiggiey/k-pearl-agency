import {
  inquiryRepository,
  propertySubmissionRepository,
  viewingRequestRepository,
  type InquiryListFilters,
  type PropertySubmissionListFilters,
  type ViewingRequestListFilters,
} from '@/repositories';
import type {
  InquiryStatus,
  Paginated,
  StaffInquiry,
  StaffPropertySubmission,
  StaffViewingRequest,
  ViewingRequestStatus,
} from '@/types';

/*
 * Staff lead management — enquiries, viewing requests and the property
 * submission review/convert flow. Thin orchestration over the repositories;
 * RLS is the authorization boundary (docs/api-design.md).
 */

export const staffLeadsService = {
  listInquiries(filters: InquiryListFilters): Promise<Paginated<StaffInquiry>> {
    return inquiryRepository.list(filters);
  },
  getInquiry(id: string): Promise<StaffInquiry | null> {
    return inquiryRepository.getById(id);
  },
  setInquiryStatus(id: string, status: InquiryStatus): Promise<void> {
    return inquiryRepository.updateStatus(id, status);
  },
  assignInquiry(id: string, staffId: string | null): Promise<void> {
    return inquiryRepository.assign(id, staffId);
  },
  setInquiryNotes(id: string, notes: string): Promise<void> {
    return inquiryRepository.updateNotes(id, notes);
  },

  listViewingRequests(filters: ViewingRequestListFilters): Promise<Paginated<StaffViewingRequest>> {
    return viewingRequestRepository.list(filters);
  },
  getViewingRequest(id: string): Promise<StaffViewingRequest | null> {
    return viewingRequestRepository.getById(id);
  },
  setViewingStatus(id: string, status: ViewingRequestStatus): Promise<void> {
    return viewingRequestRepository.updateStatus(id, status);
  },
  assignViewing(id: string, staffId: string | null): Promise<void> {
    return viewingRequestRepository.assign(id, staffId);
  },
  setViewingNotes(id: string, notes: string): Promise<void> {
    return viewingRequestRepository.updateNotes(id, notes);
  },

  listSubmissions(
    filters: PropertySubmissionListFilters,
  ): Promise<Paginated<StaffPropertySubmission>> {
    return propertySubmissionRepository.list(filters);
  },
  getSubmission(id: string): Promise<StaffPropertySubmission | null> {
    return propertySubmissionRepository.getById(id);
  },
  setSubmissionStatus(id: string, status: 'in_review' | 'declined'): Promise<void> {
    return propertySubmissionRepository.setStatus(id, status);
  },
  convertSubmission(id: string, agentId: string | null): Promise<string> {
    return propertySubmissionRepository.convert(id, agentId);
  },
};
