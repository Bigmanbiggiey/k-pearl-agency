import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Seo } from '@/components/Seo';
import { useAuth } from '@/features/auth';
import { useStaffProperties } from '@/features/staff/hooks';
import { EmptyState, StatusBadge, TableScroll } from '@/features/staff/ui';
import {
  formatPrice,
  LISTING_TYPES,
  listingTypeLabel,
  PROPERTY_STATUSES,
  propertyTypeLabel,
  statusLabel,
} from '@/lib/format';
import type { StaffPropertyFilters } from '@/repositories';
import type { ListingType, PropertyStatus } from '@/types';

const PAGE_SIZE = 20;

export default function StaffPropertiesPage() {
  const { user } = useAuth();
  const [status, setStatus] = useState<PropertyStatus | ''>('');
  const [listingType, setListingType] = useState<ListingType | ''>('');
  const [search, setSearch] = useState('');
  const [mineOnly, setMineOnly] = useState(false);
  const [page, setPage] = useState(1);

  const filters: StaffPropertyFilters = {
    page,
    pageSize: PAGE_SIZE,
    ...(status ? { status } : {}),
    ...(listingType ? { listingType } : {}),
    ...(search.trim() ? { search: search.trim() } : {}),
    ...(mineOnly && user ? { agentId: user.id } : {}),
  };

  const { data, isLoading, isError } = useStaffProperties(filters);
  const total = data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const resetPage = () => setPage(1);

  return (
    <>
      <Seo
        title="Properties"
        description="Manage K Pearl listings."
        path="/staff/properties"
        noindex
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl">Properties</h1>
        <Link
          to="/staff/properties/new"
          className="rounded-sm bg-gold px-4 py-2 text-sm font-medium text-ink hover:bg-gold-deep"
        >
          New property
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <label className="text-sm">
          <span className="mb-1 block text-xs uppercase tracking-wider text-muted">Status</span>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as PropertyStatus | '');
              resetPage();
            }}
            className="rounded-sm border border-line bg-ivory px-2 py-1.5 text-sm"
          >
            <option value="">All</option>
            {PROPERTY_STATUSES.map((s) => (
              <option key={s} value={s}>
                {statusLabel(s)}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm">
          <span className="mb-1 block text-xs uppercase tracking-wider text-muted">Listing</span>
          <select
            value={listingType}
            onChange={(e) => {
              setListingType(e.target.value as ListingType | '');
              resetPage();
            }}
            className="rounded-sm border border-line bg-ivory px-2 py-1.5 text-sm"
          >
            <option value="">All</option>
            {LISTING_TYPES.map((t) => (
              <option key={t} value={t}>
                {listingTypeLabel(t)}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm">
          <span className="mb-1 block text-xs uppercase tracking-wider text-muted">Search</span>
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              resetPage();
            }}
            placeholder="Title or KP-code"
            className="rounded-sm border border-line bg-ivory px-2 py-1.5 text-sm"
          />
        </label>

        <label className="flex items-center gap-2 pb-1.5 text-sm text-charcoal">
          <input
            type="checkbox"
            checked={mineOnly}
            onChange={(e) => {
              setMineOnly(e.target.checked);
              resetPage();
            }}
            className="h-4 w-4 accent-gold"
          />
          Assigned to me
        </label>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <p className="text-sm text-muted">Loading…</p>
        ) : isError ? (
          <EmptyState>Could not load properties. Try again.</EmptyState>
        ) : !data || data.items.length === 0 ? (
          <EmptyState>No properties match these filters.</EmptyState>
        ) : (
          <TableScroll>
            <table className="w-full min-w-[46rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-muted">
                  <th className="py-2 pr-3">Ref</th>
                  <th className="py-2 pr-3">Title</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 pr-3">Type</th>
                  <th className="py-2 pr-3">Price</th>
                  <th className="py-2 pr-3">Area</th>
                  <th className="py-2 pr-3">Photos</th>
                  <th className="py-2 pr-3" />
                </tr>
              </thead>
              <tbody>
                {data.items.map((p) => (
                  <tr key={p.id} className="border-b border-line/60">
                    <td className="py-2 pr-3 font-mono text-xs text-muted">{p.referenceCode}</td>
                    <td className="py-2 pr-3">
                      <Link to={`/staff/properties/${p.id}`} className="hover:text-gold-deep">
                        {p.title}
                      </Link>
                      {p.featured ? <span className="ml-2 text-xs text-gold-deep">★</span> : null}
                    </td>
                    <td className="py-2 pr-3">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="py-2 pr-3">
                      {listingTypeLabel(p.listingType)} · {propertyTypeLabel(p.propertyType)}
                    </td>
                    <td className="py-2 pr-3">{formatPrice(p.price, p.currency, p.pricePeriod)}</td>
                    <td className="py-2 pr-3">{p.areaName ?? '—'}</td>
                    <td className="py-2 pr-3">{p.mediaCount}</td>
                    <td className="py-2 pr-3 text-right">
                      <Link to={`/staff/properties/${p.id}`} className="text-xs text-gold-deep">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableScroll>
        )}
      </div>

      {pageCount > 1 ? (
        <div className="mt-4 flex items-center gap-3 text-sm">
          <button
            type="button"
            onClick={() => setPage((n) => Math.max(1, n - 1))}
            disabled={page <= 1}
            className="rounded-sm border border-line px-3 py-1 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-muted">
            Page {page} of {pageCount}
          </span>
          <button
            type="button"
            onClick={() => setPage((n) => Math.min(pageCount, n + 1))}
            disabled={page >= pageCount}
            className="rounded-sm border border-line px-3 py-1 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      ) : null}
    </>
  );
}
