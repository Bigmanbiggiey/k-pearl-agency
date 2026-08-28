import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Seo } from '@/components/Seo';
import {
  useStaffSubmission,
  useStaffSubmissions,
  useSubmissionActions,
} from '@/features/staff/leadHooks';
import { ConfirmButton, EmptyState, StatusBadge, TableScroll } from '@/features/staff/ui';
import { formatPrice, listingTypeLabel, propertyTypeLabel } from '@/lib/format';
import type { PropertySubmissionListFilters } from '@/repositories';
import type { PropertySubmissionStatus } from '@/types';

const STATUSES: PropertySubmissionStatus[] = ['new', 'in_review', 'converted', 'declined'];
const PAGE_SIZE = 25;

function when(iso: string): string {
  return new Date(iso).toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' });
}

function DetailPanel({ id }: { id: string }) {
  const navigate = useNavigate();
  const { data: sub, isLoading } = useStaffSubmission(id);
  const { setStatus, convert } = useSubmissionActions(id);
  const [error, setError] = useState<string | null>(null);

  if (isLoading || !sub) return <p className="mt-4 text-sm text-muted">Loading…</p>;

  const runConvert = async () => {
    setError(null);
    try {
      const newId = await convert.mutateAsync(null);
      void navigate(`/staff/properties/${newId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not convert this submission.');
    }
  };

  return (
    <div className="mt-4 space-y-4 rounded-md border border-line bg-ivory p-4">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-lg">{sub.proposedTitle}</h2>
        <StatusBadge status={sub.status} />
        <span className="text-xs text-muted">{when(sub.createdAt)}</span>
      </div>

      <dl className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
        <div>
          <dt className="inline text-muted">Submitter: </dt>
          <dd className="inline">{sub.submitterName}</dd>
        </div>
        <div>
          <dt className="inline text-muted">Phone: </dt>
          <dd className="inline">
            <a href={`tel:${sub.submitterPhone}`} className="text-gold-deep">
              {sub.submitterPhone}
            </a>
          </dd>
        </div>
        <div>
          <dt className="inline text-muted">Email: </dt>
          <dd className="inline">{sub.submitterEmail || '—'}</dd>
        </div>
        <div>
          <dt className="inline text-muted">Type: </dt>
          <dd className="inline">
            {listingTypeLabel(sub.proposedListingType)} ·{' '}
            {propertyTypeLabel(sub.proposedPropertyType)}
          </dd>
        </div>
        <div>
          <dt className="inline text-muted">Area: </dt>
          <dd className="inline">{sub.proposedAreaName ?? '—'}</dd>
        </div>
        <div>
          <dt className="inline text-muted">Price: </dt>
          <dd className="inline">{formatPrice(sub.proposedPrice, 'KES', null)}</dd>
        </div>
        <div>
          <dt className="inline text-muted">Beds / baths: </dt>
          <dd className="inline">
            {sub.proposedBedrooms ?? '—'} / {sub.proposedBathrooms ?? '—'}
          </dd>
        </div>
      </dl>

      {sub.submitterNotes ? (
        <p className="whitespace-pre-wrap rounded-sm bg-surface p-3 text-sm">
          <span className="text-muted">Notes: </span>
          {sub.submitterNotes}
        </p>
      ) : null}
      {sub.proposedDescription ? (
        <p className="whitespace-pre-wrap rounded-sm bg-surface p-3 text-sm">
          {sub.proposedDescription}
        </p>
      ) : null}

      {error ? (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}

      {sub.status === 'converted' ? (
        <p className="text-sm text-muted">
          Converted to a draft property.
          {sub.convertedPropertyId ? (
            <button
              type="button"
              onClick={() => void navigate(`/staff/properties/${sub.convertedPropertyId}`)}
              className="ml-2 text-gold-deep"
            >
              Open it
            </button>
          ) : null}
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {sub.status === 'new' ? (
            <button
              type="button"
              onClick={() => setStatus.mutate('in_review')}
              className="rounded-sm border border-line px-3 py-1.5 text-sm hover:border-gold"
            >
              Start review
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => void runConvert()}
            disabled={convert.isPending}
            className="rounded-sm bg-gold px-3 py-1.5 text-sm font-medium text-ink hover:bg-gold-deep disabled:opacity-60"
          >
            {convert.isPending ? 'Converting…' : 'Convert to draft'}
          </button>
          <ConfirmButton
            triggerLabel="Decline"
            title="Decline this submission?"
            description="The submitter is not notified. You can still convert it later."
            confirmLabel="Decline"
            onConfirm={() => setStatus.mutate('declined')}
          />
        </div>
      )}
    </div>
  );
}

export default function StaffSubmissionsPage() {
  const [status, setStatus] = useState<PropertySubmissionStatus | ''>('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string | null>(null);

  const filters: PropertySubmissionListFilters = {
    page,
    pageSize: PAGE_SIZE,
    ...(status ? { status } : {}),
  };
  const { data, isLoading, isError } = useStaffSubmissions(filters);
  const pageCount = Math.max(1, Math.ceil((data?.total ?? 0) / PAGE_SIZE));

  return (
    <>
      <Seo
        title="Submissions"
        description="Owner property submissions."
        path="/staff/submissions"
        noindex
      />
      <h1 className="text-2xl">Property submissions</h1>

      <div className="mt-4">
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as PropertySubmissionStatus | '');
            setPage(1);
          }}
          className="rounded-sm border border-line bg-ivory px-2 py-1.5 text-sm"
        >
          <option value="">Any status</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <p className="text-sm text-muted">Loading…</p>
        ) : isError ? (
          <EmptyState>Could not load submissions.</EmptyState>
        ) : !data || data.items.length === 0 ? (
          <EmptyState>No submissions match these filters.</EmptyState>
        ) : (
          <TableScroll>
            <table className="w-full min-w-[38rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-muted">
                  <th className="py-2 pr-3">Received</th>
                  <th className="py-2 pr-3">Proposed title</th>
                  <th className="py-2 pr-3">Submitter</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 pr-3" />
                </tr>
              </thead>
              <tbody>
                {data.items.map((row) => (
                  <tr key={row.id} className="border-b border-line/60">
                    <td className="py-2 pr-3 text-xs text-muted">{when(row.createdAt)}</td>
                    <td className="py-2 pr-3">{row.proposedTitle}</td>
                    <td className="py-2 pr-3">{row.submitterName}</td>
                    <td className="py-2 pr-3">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="py-2 pr-3 text-right">
                      <button
                        type="button"
                        onClick={() => setSelected(selected === row.id ? null : row.id)}
                        className="text-xs text-gold-deep"
                      >
                        {selected === row.id ? 'Close' : 'Open'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableScroll>
        )}
      </div>

      {selected ? <DetailPanel id={selected} /> : null}

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
