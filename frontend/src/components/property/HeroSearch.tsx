import { type FormEvent, useId } from 'react';
import { useNavigate } from 'react-router-dom';

import { groupAreasByCounty, useAreas } from '@/hooks';

const FIELD =
  'w-full rounded-sm border border-line bg-ivory px-3 py-2.5 text-sm text-ink focus-visible:outline-2 focus-visible:outline-gold';

export function HeroSearch() {
  const navigate = useNavigate();
  const { data: areas } = useAreas();
  const grouped = groupAreasByCounty(areas ?? []);
  const ids = {
    type: useId(),
    area: useId(),
    price: useId(),
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const params = new URLSearchParams();
    for (const key of ['listingType', 'areaId', 'maxPrice'] as const) {
      const value = form.get(key);
      if (typeof value === 'string' && value) params.set(key, value);
    }
    void navigate(`/properties${params.toString() ? `?${params.toString()}` : ''}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-3 rounded-md bg-surface/95 p-4 text-ink shadow-lg sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end"
      aria-label="Property search"
    >
      <div>
        <label htmlFor={ids.type} className="mb-1 block text-xs font-medium text-charcoal">
          I want to
        </label>
        <select id={ids.type} name="listingType" defaultValue="" className={FIELD}>
          <option value="">Rent or buy</option>
          <option value="rent">Rent</option>
          <option value="sale">Buy</option>
          <option value="short_let">Short let</option>
        </select>
      </div>

      <div>
        <label htmlFor={ids.area} className="mb-1 block text-xs font-medium text-charcoal">
          Area
        </label>
        <select id={ids.area} name="areaId" defaultValue="" className={FIELD}>
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
      </div>

      <div>
        <label htmlFor={ids.price} className="mb-1 block text-xs font-medium text-charcoal">
          Max price (KES)
        </label>
        <input
          id={ids.price}
          name="maxPrice"
          type="number"
          min="0"
          step="1000"
          inputMode="numeric"
          placeholder="Any"
          className={FIELD}
        />
      </div>

      <button
        type="submit"
        className="rounded-sm bg-gold px-6 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-gold-deep"
      >
        Search
      </button>
    </form>
  );
}
