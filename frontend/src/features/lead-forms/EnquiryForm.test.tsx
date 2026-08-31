import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { EnquiryForm } from '@/features/lead-forms';
import { renderWithProviders } from '@/test/utils';

const createInquiry = vi.fn().mockResolvedValue(undefined);
vi.mock('@/hooks', () => ({
  useCreateInquiry: () => ({ mutateAsync: createInquiry }),
}));

// Control the "submitted too fast" guard in useLeadSubmit.
let now = 1_000_000;
beforeEach(() => {
  now = 1_000_000;
  vi.spyOn(Date, 'now').mockImplementation(() => now);
  createInquiry.mockClear();
});
afterEach(() => vi.restoreAllMocks());

async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/your name/i), 'Jane Doe');
  await user.type(screen.getByLabelText(/phone number/i), '+254704061324');
  await user.type(screen.getByLabelText(/message/i), 'I would like more information please.');
  await user.click(screen.getByLabelText(/i have read the/i));
}

describe('EnquiryForm', () => {
  it('shows field errors when submitted empty', async () => {
    const user = userEvent.setup();
    renderWithProviders(<EnquiryForm type="general" />);
    now += 5000;

    await user.click(screen.getByRole('button', { name: /send enquiry/i }));

    expect(await screen.findByText(/privacy notice/i)).toBeInTheDocument();
    expect(createInquiry).not.toHaveBeenCalled();
  });

  it('submits a valid enquiry and shows the confirmation', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <EnquiryForm
        type="property_enquiry"
        propertyId="11111111-1111-1111-1111-111111111111"
        reference="KP-0007"
      />,
    );
    await fillValid(user);
    now += 5000;

    await user.click(screen.getByRole('button', { name: /send enquiry/i }));

    expect(await screen.findByText(/your enquiry is in/i)).toBeInTheDocument();
    expect(createInquiry).toHaveBeenCalledTimes(1);
    expect(createInquiry).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'property_enquiry',
        propertyId: '11111111-1111-1111-1111-111111111111',
        name: 'Jane Doe',
      }),
    );
  });

  it('silently drops a submission when the honeypot is filled', async () => {
    const user = userEvent.setup();
    renderWithProviders(<EnquiryForm type="general" />);
    await fillValid(user);
    await user.type(screen.getByLabelText('Company'), 'ACME Bots');
    now += 5000;

    await user.click(screen.getByRole('button', { name: /send enquiry/i }));

    expect(await screen.findByText(/your enquiry is in/i)).toBeInTheDocument();
    expect(createInquiry).not.toHaveBeenCalled();
  });
});
