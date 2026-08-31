import type {
  InquiryStatus,
  InquiryType,
  ListingType,
  PreferredContactMethod,
  PropertySubmissionStatus,
  PropertyType,
  ViewingRequestStatus,
} from './domain';

/** Staff-facing lead DTOs (repositories read the base tables under RLS). */

export type PreferredTime = 'morning' | 'afternoon' | 'evening';

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface StaffInquiry {
  id: string;
  type: InquiryType;
  propertyId: string | null;
  propertyTitle: string | null;
  propertyReference: string | null;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  preferredContactMethod: PreferredContactMethod;
  status: InquiryStatus;
  assignedTo: string | null;
  internalNotes: string | null;
  createdAt: string;
}

export interface StaffViewingRequest {
  id: string;
  propertyId: string | null;
  propertyTitle: string | null;
  propertyReference: string | null;
  name: string;
  phone: string;
  email: string | null;
  preferredDate: string | null;
  preferredTime: PreferredTime | null;
  message: string | null;
  status: ViewingRequestStatus;
  assignedTo: string | null;
  internalNotes: string | null;
  createdAt: string;
}

export interface StaffPropertySubmission {
  id: string;
  submitterName: string;
  submitterPhone: string;
  submitterEmail: string | null;
  submitterNotes: string | null;
  proposedTitle: string;
  proposedListingType: ListingType;
  proposedPropertyType: PropertyType;
  proposedAreaId: string | null;
  proposedAreaName: string | null;
  proposedPrice: number | null;
  proposedBedrooms: number | null;
  proposedBathrooms: number | null;
  proposedDescription: string | null;
  status: PropertySubmissionStatus;
  reviewedBy: string | null;
  convertedPropertyId: string | null;
  createdAt: string;
}
