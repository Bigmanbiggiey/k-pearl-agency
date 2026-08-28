import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ContactPage from '@/pages/public/ContactPage';
import { renderWithProviders } from '@/test/utils';

vi.mock('@/hooks', () => ({
  useSiteSettings: () => ({
    data: {
      phone: '+254704061324',
      whatsapp: '+254704061324',
      email: 'test@example.com',
      hoursWeekday: 'Mon–Fri 8–5',
      hoursWeekend: 'Sat–Sun 9–2',
      byAppointment: true,
    },
    isLoading: false,
    isError: false,
  }),
}));

// The enquiry form has its own tests; stub it here.
vi.mock('@/features/lead-forms', () => ({
  EnquiryForm: () => <form aria-label="enquiry" />,
}));

describe('ContactPage', () => {
  it('renders tap-to-call, WhatsApp and mailto links from site settings', () => {
    renderWithProviders(<ContactPage />);

    expect(screen.getByRole('link', { name: '+254704061324' })).toHaveAttribute(
      'href',
      'tel:+254704061324',
    );
    expect(screen.getByRole('link', { name: /message on whatsapp/i })).toHaveAttribute(
      'href',
      expect.stringContaining('https://wa.me/254704061324'),
    );
    expect(screen.getByRole('link', { name: 'test@example.com' })).toHaveAttribute(
      'href',
      expect.stringContaining('mailto:test@example.com'),
    );
    expect(screen.getByText(/by appointment/i)).toBeInTheDocument();
  });
});
