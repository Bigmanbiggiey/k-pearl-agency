import { useId, type ReactNode } from 'react';

import { hasActiveFilters } from './filterParams';

import { groupAreasByCounty, useAreas } from '@/hooks';
import { LISTING_TYPES, PROPERTY_TYPES, propertyTypeLabel } from '@/lib/format';
import type { PropertySearchInput } from '@/schemas';
import type { ListingType, PropertyType } from '@/types';

interface Props {
  filters: PropertySearchInput;
  setFilter: <K extends keyof PropertySearchInput>(key: K, value: PropertySearchInput[K]) => void;
  onClear: () => void;
}

const LISTING_LABEL: Record<ListingType, string> = {
  rent: 'Rent',
  sale: 'Buy',
  short_let: 'Short let',
};

const FIELD =
  'w-full rounded-sm border border-line bg-ivory px-3 py-2 text-sm text-ink focus-visible:outline-2 focus-visible:outline-gold';

function Fieldset({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">{label}</p>
      {children}
    </div>
  );
}

function Segmented<T extends string | number>({
  options,
  value,
  onChange,
}: {
  options: Array<{ value: T | undefined; label: string }>;
  value: T | undefined;
  onChange: (v: T | undefined) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.label}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={`rounded-sm border px-3 py-1.5 text-sm transition-colors ${
              active
                ? 'border-gold bg-gold/15 font-medium text-gold-deep'
                : 'border-line text-charcoal hover:border-gold'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function PropertyFilters({ filters, setFilter, onClear }: Props) {
  const { data: areas } = useAreas();
  const grouped = groupAreasByCounty(areas ?? []);
  const ids = { type: useId(), area: useId(), min: useId(), max: useId(), verified: useId() };

  const numberOrUndefined = (raw: string): number | undefined =>
    raw.trim() === '' ? undefined : Number(raw);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg">Filters</h2>
        {hasActiveFilters(filters) ? (
          <button
            type="button"
            onClick={onClear}
            className="text-sm text-gold-deep underline underline-offset-4"
          >
            Clear all
          </button>
        ) : null}
      </div>

      <Fieldset label="I want to">
        <Segmented<ListingType>
          value={filters.listingType}
          onChange={(v) => setFilter('listingType', v)}
          options={[
            { value: undefined, label: 'Any' },
            ...LISTING_TYPES.map((t) => ({ value: t, label: LISTING_LABEL[t] })),
          ]}
        />
      </Fieldset>

      <Fieldset label="Property type">
        <select
          id={ids.type}
          className={FIELD}
          value={filters.propertyType ?? ''}
          onChange={(e) =>
            setFilter(
              'propertyType',
              (e.currentTarget.value || undefined) as PropertyType | undefined,
            )
          }
        >
          <option value="">Any type</option>
          {PROPERTY_TYPES.map((t) => (
            <option key={t} value={t}>
              {propertyTypeLabel(t)}
            </option>
          ))}
        </select>
      </Fieldset>

      <Fieldset label="Area">
        <select
          id={ids.area}
          className={FIELD}
          value={filters.areaId ?? ''}
          onChange={(e) => setFilter('areaId', e.currentTarget.value || undefined)}
        >
          <option value="">Any area</option>
          {grouped.map((group) => (
            <optgroup key={group.county} label={group.county}>
              {group.areas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </Fieldset>

      <Fieldset label="Price (KES)">
        <div className="flex items-center gap-2">
          <input
            id={ids.min}
            aria-label="Minimum price"
            type="number"
            min="0"
            step="1000"
            inputMode="numeric"
            placeholder="Min"
            className={FIELD}
            value={filters.minPrice ?? ''}
            onChange={(e) => setFilter('minPrice', numberOrUndefined(e.currentTarget.value))}
          />
          <span className="text-muted">–</span>
          <input
            id={ids.max}
            aria-label="Maximum price"
            type="number"
            min="0"
            step="1000"
            inputMode="numeric"
            placeholder="Max"
            className={FIELD}
            value={filters.maxPrice ?? ''}
            onChange={(e) => setFilter('maxPrice', numberOrUndefined(e.currentTarget.value))}
          />
        </div>
      </Fieldset>

      <Fieldset label="Bedrooms">
        <Segmented<number>
          value={filters.minBedrooms}
          onChange={(v) => setFilter('minBedrooms', v)}
          options={[
            { value: undefined, label: 'Any' },
            { value: 1, label: '1+' },
            { value: 2, label: '2+' },
            { value: 3, label: '3+' },
            { value: 4, label: '4+' },
          ]}
        />
      </Fieldset>

      <label htmlFor={ids.verified} className="flex items-center gap-2 text-sm text-charcoal">
        <input
          id={ids.verified}
          type="checkbox"
          className="h-4 w-4 accent-gold"
          checked={filters.verifiedOnly ?? false}
          onChange={(e) => setFilter('verifiedOnly', e.currentTarget.checked || undefined)}
        />
        Verified listings only
      </label>
    </div>
  );
}
