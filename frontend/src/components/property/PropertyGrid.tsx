import { PropertyCard } from '@/components/property/PropertyCard';
import type { PropertySummary } from '@/types';

interface Props {
  properties: PropertySummary[] | undefined;
  isLoading: boolean;
  isError?: boolean;
  emptyMessage?: string;
  skeletonCount?: number;
}

function Skeleton() {
  return (
    <div className="overflow-hidden rounded-md border border-line bg-ivory">
      <div className="aspect-[4/3] animate-pulse bg-line/60" />
      <div className="space-y-2 p-4">
        <div className="h-4 w-1/3 animate-pulse rounded bg-line/60" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-line/60" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-line/60" />
      </div>
    </div>
  );
}

export function PropertyGrid({
  properties,
  isLoading,
  isError = false,
  emptyMessage = 'No properties to show yet.',
  skeletonCount = 3,
}: Props) {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: skeletonCount }, (_, i) => (
          <Skeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return <p className="text-muted">We couldn’t load properties just now. Please try again.</p>;
  }

  if (!properties || properties.length === 0) {
    return <p className="text-muted">{emptyMessage}</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
