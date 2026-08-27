import { render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Seo } from '@/components/Seo';

describe('Seo', () => {
  it('sets the document title with the site suffix and a description meta', async () => {
    render(<Seo title="About" description="About K Pearl Agency." path="/about" />);

    await waitFor(() => {
      expect(document.title).toBe('About — K Pearl Agency');
    });
    const description = document.querySelector('meta[name="description"]');
    expect(description?.getAttribute('content')).toBe('About K Pearl Agency.');
    const canonical = document.querySelector('link[rel="canonical"]');
    expect(canonical?.getAttribute('href')).toBe('https://k-pearl-agency.vercel.app/about');
  });

  it('adds a JSON-LD script when provided', async () => {
    render(
      <Seo
        title="Listing"
        description="A listing."
        path="/properties/x"
        jsonLd={{ '@type': 'RealEstateListing', name: 'X' }}
      />,
    );

    await waitFor(() => {
      const script = document.querySelector('script[type="application/ld+json"]');
      expect(script?.textContent).toContain('RealEstateListing');
    });
  });
});
