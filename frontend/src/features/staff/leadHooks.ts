import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type {
  InquiryListFilters,
  PropertySubmissionListFilters,
  ViewingRequestListFilters,
} from '@/repositories';
import { staffLeadsService } from '@/services';
import type {
  InquiryStatus,
  Paginated,
  StaffInquiry,
  StaffPropertySubmission,
  StaffViewingRequest,
  ViewingRequestStatus,
} from '@/types';

const k = {
  inquiries: (f: InquiryListFilters) => ['staff', 'inquiries', f] as const,
  inquiry: (id: string) => ['staff', 'inquiry', id] as const,
  viewings: (f: ViewingRequestListFilters) => ['staff', 'viewings', f] as const,
  viewing: (id: string) => ['staff', 'viewing', id] as const,
  submissions: (f: PropertySubmissionListFilters) => ['staff', 'submissions', f] as const,
  submission: (id: string) => ['staff', 'submission', id] as const,
  counts: ['staff', 'dashboard-counts'] as const,
};

type QC = ReturnType<typeof useQueryClient>;

// ─── Enquiries ───────────────────────────────────────────────────────────

export function useStaffInquiries(filters: InquiryListFilters) {
  return useQuery<Paginated<StaffInquiry>>({
    queryKey: k.inquiries(filters),
    queryFn: () => staffLeadsService.listInquiries(filters),
    placeholderData: keepPreviousData,
  });
}

export function useStaffInquiry(id: string | undefined) {
  return useQuery<StaffInquiry | null>({
    queryKey: k.inquiry(id ?? ''),
    queryFn: () => staffLeadsService.getInquiry(id ?? ''),
    enabled: Boolean(id),
  });
}

function invalidateInquiry(qc: QC, id: string) {
  void qc.invalidateQueries({ queryKey: ['staff', 'inquiries'] });
  void qc.invalidateQueries({ queryKey: k.inquiry(id) });
  void qc.invalidateQueries({ queryKey: k.counts });
}

export function useInquiryActions(id: string) {
  const qc = useQueryClient();
  const done = () => invalidateInquiry(qc, id);
  return {
    setStatus: useMutation<void, Error, InquiryStatus>({
      mutationFn: (status) => staffLeadsService.setInquiryStatus(id, status),
      onSuccess: done,
    }),
    assign: useMutation<void, Error, string | null>({
      mutationFn: (staffId) => staffLeadsService.assignInquiry(id, staffId),
      onSuccess: done,
    }),
    setNotes: useMutation<void, Error, string>({
      mutationFn: (notes) => staffLeadsService.setInquiryNotes(id, notes),
      onSuccess: done,
    }),
  };
}

// ─── Viewing requests ────────────────────────────────────────────────────

export function useStaffViewingRequests(filters: ViewingRequestListFilters) {
  return useQuery<Paginated<StaffViewingRequest>>({
    queryKey: k.viewings(filters),
    queryFn: () => staffLeadsService.listViewingRequests(filters),
    placeholderData: keepPreviousData,
  });
}

export function useStaffViewingRequest(id: string | undefined) {
  return useQuery<StaffViewingRequest | null>({
    queryKey: k.viewing(id ?? ''),
    queryFn: () => staffLeadsService.getViewingRequest(id ?? ''),
    enabled: Boolean(id),
  });
}

function invalidateViewing(qc: QC, id: string) {
  void qc.invalidateQueries({ queryKey: ['staff', 'viewings'] });
  void qc.invalidateQueries({ queryKey: k.viewing(id) });
  void qc.invalidateQueries({ queryKey: k.counts });
}

export function useViewingActions(id: string) {
  const qc = useQueryClient();
  const done = () => invalidateViewing(qc, id);
  return {
    setStatus: useMutation<void, Error, ViewingRequestStatus>({
      mutationFn: (status) => staffLeadsService.setViewingStatus(id, status),
      onSuccess: done,
    }),
    assign: useMutation<void, Error, string | null>({
      mutationFn: (staffId) => staffLeadsService.assignViewing(id, staffId),
      onSuccess: done,
    }),
    setNotes: useMutation<void, Error, string>({
      mutationFn: (notes) => staffLeadsService.setViewingNotes(id, notes),
      onSuccess: done,
    }),
  };
}

// ─── Property submissions ────────────────────────────────────────────────

export function useStaffSubmissions(filters: PropertySubmissionListFilters) {
  return useQuery<Paginated<StaffPropertySubmission>>({
    queryKey: k.submissions(filters),
    queryFn: () => staffLeadsService.listSubmissions(filters),
    placeholderData: keepPreviousData,
  });
}

export function useStaffSubmission(id: string | undefined) {
  return useQuery<StaffPropertySubmission | null>({
    queryKey: k.submission(id ?? ''),
    queryFn: () => staffLeadsService.getSubmission(id ?? ''),
    enabled: Boolean(id),
  });
}

function invalidateSubmission(qc: QC, id: string) {
  void qc.invalidateQueries({ queryKey: ['staff', 'submissions'] });
  void qc.invalidateQueries({ queryKey: k.submission(id) });
  void qc.invalidateQueries({ queryKey: k.counts });
  void qc.invalidateQueries({ queryKey: ['staff', 'properties'] });
}

export function useSubmissionActions(id: string) {
  const qc = useQueryClient();
  const done = () => invalidateSubmission(qc, id);
  return {
    setStatus: useMutation<void, Error, 'in_review' | 'declined'>({
      mutationFn: (status) => staffLeadsService.setSubmissionStatus(id, status),
      onSuccess: done,
    }),
    convert: useMutation<string, Error, string | null>({
      mutationFn: (agentId) => staffLeadsService.convertSubmission(id, agentId),
      onSuccess: done,
    }),
  };
}
