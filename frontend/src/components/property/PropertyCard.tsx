import { Link } from 'react-router-dom';

import { PropertyImage } from '@/components/property/PropertyImage';
import { Badge } from '@/components/ui';
import { formatPrice, listingTypeLabel } from '@/lib/format';
import type { PropertySummary } from '@/types';

interface Props {
  property: PropertySummary;
}

export function PropertyCard({ property }: Props) {
  const location = [property.areaName, property.areaCounty].filter(Boolean).join(', ');
  const specs: string[] = [];
  if (property.bedrooms != null) specs.push(`${property.bedrooms} bed`);
  if (property.bathrooms != null) specs.push(`${property.bathrooms} bath`);

  return (
    <article className="group overflow-hidden rounded-md border border-line bg-ivory shadow-sm transition-shadow hover:shadow-md">
      <Link to={`/properties/${property.slug}`} className="block focus-visible:outline-none">
        <div className="relative">
          <PropertyImage
            media={property.coverImage}
            propertyType={property.propertyType}
            title={property.title}
          />
          <div className="absolute left-3 top-3 flex gap-2">
            <Badge tone="gold">{listingTypeLabel(property.listingType)}</Badge>
            {property.verified ? <Badge tone="neutral">Verified</Badge> : null}
          </div>
        </div>

        <div className="p-4">
          <p className="text-base font-semibold text-gold-deep">
            {formatPrice(property.price, property.currency, property.pricePeriod)}
          </p>
          <h3 className="mt-1 line-clamp-2 text-lg text-ink group-hover:underline group-hover:decoration-gold group-hover:underline-offset-4">
            {property.title}
          </h3>
          {location ? <p className="mt-1 text-sm text-muted">{location}</p> : null}
          {specs.length > 0 ? (
            <p className="mt-3 text-sm text-charcoal">{specs.join(' · ')}</p>
          ) : null}
          <p className="mt-2 text-xs uppercase tracking-wider text-muted">
            {property.referenceCode}
          </p>
        </div>
      </Link>
    </article>
  );
}
