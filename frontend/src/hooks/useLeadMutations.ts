import { useMutation } from '@tanstack/react-query';

import type { InquiryInput, PropertySubmissionInput, ViewingRequestInput } from '@/schemas';
import { inquiryService, propertySubmissionService, viewingRequestService } from '@/services';

export function useCreateInquiry() {
  return useMutation({ mutationFn: (input: InquiryInput) => inquiryService.create(input) });
}

export function useCreateViewingRequest() {
  return useMutation({
    mutationFn: (input: ViewingRequestInput) => viewingRequestService.create(input),
  });
}

export function useCreatePropertySubmission() {
  return useMutation({
    mutationFn: (input: PropertySubmissionInput) => propertySubmissionService.create(input),
  });
}
