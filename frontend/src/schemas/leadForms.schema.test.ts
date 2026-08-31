import { describe, expect, it } from 'vitest';

import { inquirySchema } from './inquiry.schema';
import { propertySubmissionSchema } from './propertySubmission.schema';
import { viewingRequestSchema } from './viewingRequest.schema';

const validInquiry = {
  type: 'general' as const,
  name: 'Jane Doe',
  phone: '+254712345678',
  email: '',
  message: 'I would like more information please.',
  preferredContactMethod: 'phone' as const,
  consent: true as const,
  company: '',
};

describe('inquirySchema', () => {
  it('accepts a valid general enquiry', () => {
    expect(inquirySchema.safeParse(validInquiry).success).toBe(true);
  });

  it('requires consent to be true', () => {
    const r = inquirySchema.safeParse({ ...validInquiry, consent: false });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues.some((i) => i.path[0] === 'consent')).toBe(true);
  });

  it('rejects a non-Kenyan phone number', () => {
    const r = inquirySchema.safeParse({ ...validInquiry, phone: '12345' });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues.some((i) => i.path[0] === 'phone')).toBe(true);
  });

  it('requires a propertyId for a property_enquiry', () => {
    const r = inquirySchema.safeParse({ ...validInquiry, type: 'property_enquiry' });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues.some((i) => i.path[0] === 'propertyId')).toBe(true);
  });

  it('rejects an over-long message', () => {
    expect(inquirySchema.safeParse({ ...validInquiry, message: 'x'.repeat(2100) }).success).toBe(
      false,
    );
  });

  it('accepts a honeypot value at the schema level (dropped later by the app)', () => {
    expect(inquirySchema.safeParse({ ...validInquiry, company: 'ACME' }).success).toBe(true);
  });
});

describe('viewingRequestSchema', () => {
  const base = {
    propertyId: '11111111-1111-1111-1111-111111111111',
    name: 'Jane Doe',
    phone: '0712345678',
    consent: true as const,
  };

  it('accepts a minimal valid request', () => {
    expect(viewingRequestSchema.safeParse(base).success).toBe(true);
  });

  it('rejects an invalid preferred time', () => {
    expect(viewingRequestSchema.safeParse({ ...base, preferredTime: 'midnight' }).success).toBe(
      false,
    );
  });

  it('requires a property id', () => {
    expect(viewingRequestSchema.safeParse({ ...base, propertyId: 'nope' }).success).toBe(false);
  });
});

describe('propertySubmissionSchema', () => {
  const base = {
    submitterName: 'Owner Name',
    submitterPhone: '+254712345678',
    proposedTitle: '3-bed apartment in Kilimani',
    proposedListingType: 'rent' as const,
    proposedPropertyType: 'apartment' as const,
    consent: true as const,
  };

  it('accepts a minimal valid submission', () => {
    expect(propertySubmissionSchema.safeParse(base).success).toBe(true);
  });

  it('rejects an unknown listing type', () => {
    expect(
      propertySubmissionSchema.safeParse({ ...base, proposedListingType: 'lease' }).success,
    ).toBe(false);
  });

  it('requires consent', () => {
    expect(propertySubmissionSchema.safeParse({ ...base, consent: false }).success).toBe(false);
  });
});
