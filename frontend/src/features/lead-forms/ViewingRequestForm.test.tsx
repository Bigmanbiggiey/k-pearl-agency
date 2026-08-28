import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ViewingRequestForm } from '@/features/lead-forms';
import { renderWithProviders } from '@/test/utils';

const createViewingRequest = vi.fn().mockResolvedValue(undefined);
vi.mock('@/hooks', () => ({
  useCreateViewingRequest: () => ({ mutateAsync: createViewingRequest }),
}));

let now = 1_000_000;
beforeEach(() => {
  now = 1_000_000;
  vi.spyOn(Date, 'now').mockImplementation(() => now);
  createViewingRequest.mockClear();
});
afterEach(() => vi.restoreAllMocks());

describe('ViewingRequestForm', () => {
  it('submits a valid request with the property id and preferred time', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <ViewingRequestForm propertyId="11111111-1111-1111-1111-111111111111" reference="KP-0001" />,
    );

    await user.type(screen.getByLabelText(/your name/i), 'Jane Doe');
    await user.type(screen.getByLabelText(/phone number/i), '0712345678');
    await user.selectOptions(screen.getByLabelText(/preferred time/i), 'morning');
    await user.click(screen.getByLabelText(/i have read the/i));
    now += 5000;

    await user.click(screen.getByRole('button', { name: /request viewing/i }));

    expect(await screen.findByText(/viewing request received/i)).toBeInTheDocument();
    expect(createViewingRequest).toHaveBeenCalledTimes(1);
    expect(createViewingRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        propertyId: '11111111-1111-1111-1111-111111111111',
        preferredTime: 'morning',
      }),
    );
  });

  it('blocks submission without consent', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ViewingRequestForm propertyId="11111111-1111-1111-1111-111111111111" />);
    await user.type(screen.getByLabelText(/your name/i), 'Jane Doe');
    await user.type(screen.getByLabelText(/phone number/i), '0712345678');
    now += 5000;

    await user.click(screen.getByRole('button', { name: /request viewing/i }));

    expect(createViewingRequest).not.toHaveBeenCalled();
  });
});
