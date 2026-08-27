import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { usePropertyFilters } from './usePropertyFilters';

function wrapper(initial: string) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <MemoryRouter initialEntries={[initial]}>{children}</MemoryRouter>;
  };
}

function useHarness() {
  return { ...usePropertyFilters(), location: useLocation() };
}

describe('usePropertyFilters', () => {
  it('reads filters from the URL', () => {
    const { result } = renderHook(useHarness, {
      wrapper: wrapper('/properties?listingType=rent&page=2'),
    });
    expect(result.current.filters.listingType).toBe('rent');
    expect(result.current.filters.page).toBe(2);
  });

  it('setFilter resets page to 1', () => {
    const { result } = renderHook(useHarness, { wrapper: wrapper('/properties?page=4') });
    act(() => {
      result.current.setFilter('listingType', 'sale');
    });
    expect(result.current.filters.listingType).toBe('sale');
    expect(result.current.filters.page).toBe(1);
    expect(result.current.location.search).not.toContain('page=');
  });

  it('changing only the page keeps the other filters', () => {
    const { result } = renderHook(useHarness, {
      wrapper: wrapper('/properties?listingType=rent'),
    });
    act(() => {
      result.current.setFilter('page', 3);
    });
    expect(result.current.filters.page).toBe(3);
    expect(result.current.filters.listingType).toBe('rent');
  });

  it('clearFilters empties the query but keeps sort', () => {
    const { result } = renderHook(useHarness, {
      wrapper: wrapper('/properties?listingType=rent&minBedrooms=2&sort=price_asc'),
    });
    act(() => {
      result.current.clearFilters();
    });
    expect(result.current.filters.listingType).toBeUndefined();
    expect(result.current.filters.minBedrooms).toBeUndefined();
    expect(result.current.filters.sort).toBe('price_asc');
  });
});
