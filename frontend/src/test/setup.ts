import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

import '@testing-library/jest-dom/vitest';

// vitest runs with `globals: false`, so Testing Library's automatic cleanup
// is not wired up. Do it explicitly.
afterEach(() => {
  cleanup();
});
