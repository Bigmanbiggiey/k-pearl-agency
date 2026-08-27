/**
 * Central TanStack Query key factory. Keeps cache keys consistent across hooks
 * (docs/coding-standards.md — server state via TanStack Query).
 */
export const queryKeys = {
  properties: {
    all: ['properties'] as const,
    list: (filters: unknown) => ['properties', 'list', filters] as const,
    detail: (slug: string) => ['properties', 'detail', slug] as const,
    featured: (limit: number) => ['properties', 'featured', limit] as const,
  },
  inquiries: {
    all: ['inquiries'] as const,
    list: (filters: unknown) => ['inquiries', 'list', filters] as const,
    detail: (id: string) => ['inquiries', 'detail', id] as const,
  },
  viewingRequests: {
    all: ['viewingRequests'] as const,
    list: (filters: unknown) => ['viewingRequests', 'list', filters] as const,
  },
} as const;
