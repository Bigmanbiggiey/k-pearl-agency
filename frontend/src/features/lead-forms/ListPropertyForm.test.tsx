import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ListPropertyForm } from '@/features/lead-forms';
import { renderWithProviders } from '@/test/utils';

const createSubmission = vi.fn().mockResolvedValue(undefined);
vi.mock('@/hooks', () => ({
  useAreas: () => ({ data: [] }),
  groupAreasByCounty: () => [],
  useCreatePropertySubmission: () => ({ mutateAsync: createSubmission }),
}));

let now = 1_000_000;
beforeEach(() => {
  now = 1_000_000;
  vi.spyOn(Date, 'now').mockImplementation(() => now);
  createSubmission.mockClear();
});
afterEach(() => vi.restoreAllMocks());

describe('ListPropertyForm', () => {
  it('submits a valid property submission', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ListPropertyForm />);

    await user.type(screen.getByLabelText(/your name/i), 'Owner Name');
    await user.type(screen.getByLabelText(/phone number/i), '+254712345678');
    await user.type(screen.getByLabelText(/^title/i), '3-bed apartment in Kilimani');
    await user.selectOptions(screen.getByLabelText(/listing type/i), 'rent');
    await user.selectOptions(screen.getByLabelText(/property type/i), 'apartment');
    await user.type(screen.getByLabelText(/price/i), '90000');
    await user.click(screen.getByLabelText(/i have read the/i));
    now += 5000;

    await user.click(screen.getByRole('button', { name: /submit property/i }));

    expect(await screen.findByText(/we.*got your property/i)).toBeInTheDocument();
    expect(createSubmission).toHaveBeenCalledTimes(1);
    expect(createSubmission).toHaveBeenCalledWith(
      expect.objectContaining({
        proposedTitle: '3-bed apartment in Kilimani',
        proposedListingType: 'rent',
        proposedPropertyType: 'apartment',
        proposedPrice: 90000,
      }),
    );
  });

  it('requires the listing and property type', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ListPropertyForm />);
    await user.type(screen.getByLabelText(/your name/i), 'Owner Name');
    await user.type(screen.getByLabelText(/phone number/i), '+254712345678');
    await user.type(screen.getByLabelText(/^title/i), 'A property');
    await user.click(screen.getByLabelText(/i have read the/i));
    now += 5000;

    await user.click(screen.getByRole('button', { name: /submit property/i }));
    expect(createSubmission).not.toHaveBeenCalled();
  });
});
