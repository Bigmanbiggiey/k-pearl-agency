import { useAreas } from '@/hooks';
import { listingTypeLabel, propertyTypeLabel } from '@/lib/format';
import type { PropertySearchInput } from '@/schemas';

interface Props {
  filters: PropertySearchInput;
  setFilter: <K extends keyof PropertySearchInput>(key: K, value: PropertySearchInput[K]) => void;
}

const priceFmt = new Intl.NumberFormat('en-KE', { maximumFractionDigits: 0 });

export function ActiveFilterChips({ filters, setFilter }: Props) {
  const { data: areas } = useAreas();

  const chips: Array<{ key: keyof PropertySearchInput; label: string }> = [];
  if (filters.listingType)
    chips.push({ key: 'listingType', label: listingTypeLabel(filters.listingType) });
  if (filters.propertyType)
    chips.push({ key: 'propertyType', label: propertyTypeLabel(filters.propertyType) });
  if (filters.areaId) {
    const area = areas?.find((a) => a.id === filters.areaId);
    chips.push({ key: 'areaId', label: area ? area.name : 'Selected area' });
  }
  if (filters.minPrice != null)
    chips.push({ key: 'minPrice', label: `Min KES ${priceFmt.format(filters.minPrice)}` });
  if (filters.maxPrice != null)
    chips.push({ key: 'maxPrice', label: `Max KES ${priceFmt.format(filters.maxPrice)}` });
  if (filters.minBedrooms != null)
    chips.push({ key: 'minBedrooms', label: `${filters.minBedrooms}+ beds` });
  if (filters.verifiedOnly) chips.push({ key: 'verifiedOnly', label: 'Verified only' });
  if (filters.keyword) chips.push({ key: 'keyword', label: `“${filters.keyword}”` });

  if (chips.length === 0) return null;

  return (
    <ul className="mb-6 flex flex-wrap gap-2">
      {chips.map((chip) => (
        <li key={chip.key}>
          <button
            type="button"
            onClick={() => setFilter(chip.key, undefined)}
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-ivory px-3 py-1 text-sm text-charcoal hover:border-gold"
          >
            {chip.label}
            <span aria-hidden="true">×</span>
            <span className="sr-only">Remove filter</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
