import { useId } from 'react';

import type { PropertySort } from '@/schemas';

const OPTIONS: Array<{ value: PropertySort; label: string }> = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
];

interface Props {
  value: PropertySort;
  onChange: (value: PropertySort) => void;
}

export function SortSelect({ value, onChange }: Props) {
  const id = useId();
  return (
    <div className="flex items-center gap-2">
      <label htmlFor={id} className="text-sm text-muted">
        Sort
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.currentTarget.value as PropertySort)}
        className="rounded-sm border border-line bg-ivory px-3 py-2 text-sm text-ink focus-visible:outline-2 focus-visible:outline-gold"
      >
        {OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
