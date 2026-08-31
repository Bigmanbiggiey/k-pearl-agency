import { useState } from 'react';

import { Seo } from '@/components/Seo';
import { useStaffProfiles } from '@/features/staff/hooks';
import {
  useStaffViewingRequest,
  useStaffViewingRequests,
  useViewingActions,
} from '@/features/staff/leadHooks';
import { EmptyState, StatusBadge, TableScroll } from '@/features/staff/ui';
import type { ViewingRequestListFilters } from '@/repositories';
import type { ViewingRequestStatus } from '@/types';

const STATUSES: ViewingRequestStatus[] = ['new', 'scheduled', 'completed', 'cancelled'];
const PAGE_SIZE = 25;

function when(iso: string): string {
  return new Date(iso).toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' });
}

function DetailPanel({ id }: { id: string }) {
  const { data: vr, isLoading } = useStaffViewingRequest(id);
  const { data: profiles = [] } = useStaffProfiles();
  const { setStatus, assign, setNotes } = useViewingActions(id);
  const [notes, setNotesValue] = useState<string | null>(null);

  if (isLoading || !vr) return <p className="mt-4 text-sm text-muted">Loading…</p>;
  const noteText = notes ?? vr.internalNotes ?? '';

  return (
    <div className="mt-4 space-y-4 rounded-md border border-line bg-ivory p-4">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-lg">{vr.name}</h2>
        <StatusBadge status={vr.status} />
        <span className="text-xs text-muted">{when(vr.createdAt)}</span>
      </div>

      <dl className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
        <div>
          <dt className="inline text-muted">Phone: </dt>
          <dd className="inline">
            <a href={`tel:${vr.phone}`} className="text-gold-deep">
              {vr.phone}
            </a>
          </dd>
        </div>
        <div>
          <dt className="inline text-muted">Email: </dt>
          <dd className="inline">{vr.email || '—'}</dd>
        </div>
        <div>
          <dt className="inline text-muted">Preferred: </dt>
          <dd className="inline">
            {vr.preferredDate ?? 'Any date'}
            {vr.preferredTime ? ` · ${vr.preferredTime}` : ''}
          </dd>
        </div>
        <div>
          <dt className="inline text-muted">Property: </dt>
          <dd className="inline">
            {vr.propertyReference ? `${vr.propertyReference} · ${vr.propertyTitle ?? ''}` : '—'}
          </dd>
        </div>
      </dl>

      {vr.message ? (
        <p className="whitespace-pre-wrap rounded-sm bg-surface p-3 text-sm">{vr.message}</p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block text-xs uppercase tracking-wider text-muted">Status</span>
          <select
            value={vr.status}
            onChange={(e) => setStatus.mutate(e.target.value as ViewingRequestStatus)}
            className="w-full rounded-sm border border-line bg-surface px-2 py-1.5 text-sm"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-xs uppercase tracking-wider text-muted">
            Assigned to
          </span>
          <select
            value={vr.assignedTo ?? ''}
            onChange={(e) => assign.mutate(e.target.value || null)}
            className="w-full rounded-sm border border-line bg-surface px-2 py-1.5 text-sm"
          >
            <option value="">Unassigned</option>
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.fullName || p.id}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <label
          htmlFor="vr-notes"
          className="mb-1 block text-xs uppercase tracking-wider text-muted"
        >
          Internal notes
        </label>
        <textarea
          id="vr-notes"
          rows={3}
          value={noteText}
          onChange={(e) => setNotesValue(e.target.value)}
          className="w-full rounded-sm border border-line bg-surface px-2 py-1.5 text-sm"
        />
        <button
          type="button"
          onClick={() => setNotes.mutate(noteText)}
          disabled={setNotes.isPending}
          className="mt-2 rounded-sm border border-line px-3 py-1.5 text-sm hover:border-gold disabled:opacity-60"
        >
          {setNotes.isPending ? 'Saving…' : 'Save notes'}
        </button>
      </div>
    </div>
  );
}

export default function StaffViewingsPage() {
  const [status, setStatus] = useState<ViewingRequestStatus | ''>('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string | null>(null);

  const filters: ViewingRequestListFilters = {
    page,
    pageSize: PAGE_SIZE,
    ...(status ? { status } : {}),
  };
  const { data, isLoading, isError } = useStaffViewingRequests(filters);
  const pageCount = Math.max(1, Math.ceil((data?.total ?? 0) / PAGE_SIZE));

  return (
    <>
      <Seo
        title="Viewings"
        description="K Pearl viewing requests."
        path="/staff/viewings"
        noindex
      />
      <h1 className="text-2xl">Viewing requests</h1>

      <div className="mt-4">
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as ViewingRequestStatus | '');
            setPage(1);
          }}
          className="rounded-sm border border-line bg-ivory px-2 py-1.5 text-sm"
        >
          <option value="">Any status</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <p className="text-sm text-muted">Loading…</p>
        ) : isError ? (
          <EmptyState>Could not load viewing requests.</EmptyState>
        ) : !data || data.items.length === 0 ? (
          <EmptyState>No viewing requests match these filters.</EmptyState>
        ) : (
          <TableScroll>
            <table className="w-full min-w-[40rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-muted">
                  <th className="py-2 pr-3">Received</th>
                  <th className="py-2 pr-3">Name</th>
                  <th className="py-2 pr-3">Property</th>
                  <th className="py-2 pr-3">Preferred</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 pr-3" />
                </tr>
              </thead>
              <tbody>
                {data.items.map((row) => (
                  <tr key={row.id} className="border-b border-line/60">
                    <td className="py-2 pr-3 text-xs text-muted">{when(row.createdAt)}</td>
                    <td className="py-2 pr-3">{row.name}</td>
                    <td className="py-2 pr-3">{row.propertyReference ?? '—'}</td>
                    <td className="py-2 pr-3">
                      {row.preferredDate ?? 'Any'}
                      {row.preferredTime ? ` · ${row.preferredTime}` : ''}
                    </td>
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
