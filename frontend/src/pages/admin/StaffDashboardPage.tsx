import { Link } from 'react-router-dom';

import { Seo } from '@/components/Seo';
import { useAuth } from '@/features/auth';
import { useDashboardCounts } from '@/features/staff/hooks';
import { StatTile } from '@/features/staff/ui';

export default function StaffDashboardPage() {
  const { profile } = useAuth();
  const { data, isLoading } = useDashboardCounts();

  return (
    <>
      <Seo title="Dashboard" description="K Pearl Agency staff dashboard." path="/staff" noindex />
      <h1 className="text-2xl">
        Welcome{profile?.fullName ? `, ${profile.fullName.split(' ')[0]}` : ''}
      </h1>

      {isLoading || !data ? (
        <p className="mt-6 text-muted">Loading…</p>
      ) : (
        <>
          <section className="mt-6">
            <h2 className="text-sm font-medium uppercase tracking-wider text-muted">
              Needs attention
            </h2>
            <div className="mt-3 grid gap-4 sm:grid-cols-3">
              <StatTile
                label="New enquiries"
                value={data.inquiriesNew}
                to="/staff/enquiries"
                emphasis
              />
              <StatTile
                label="New viewing requests"
                value={data.viewingRequestsNew}
                to="/staff/viewings"
                emphasis
              />
              <StatTile
                label="New submissions"
                value={data.submissionsNew}
                to="/staff/submissions"
                emphasis
              />
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-sm font-medium uppercase tracking-wider text-muted">Properties</h2>
            <div className="mt-3 grid gap-4 sm:grid-cols-4">
              <StatTile label="Total" value={data.propertiesTotal} to="/staff/properties" />
              <StatTile label="Published" value={data.propertiesPublished} to="/staff/properties" />
              <StatTile label="Draft" value={data.propertiesDraft} to="/staff/properties" />
              <StatTile
                label="Unavailable"
                value={data.propertiesUnavailable}
                to="/staff/properties"
              />
            </div>
          </section>
        </>
      )}

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          to="/staff/properties/new"
          className="rounded-sm bg-gold px-5 py-2.5 text-sm font-medium text-ink hover:bg-gold-deep"
        >
          New property
        </Link>
        <Link
          to="/staff/submissions"
          className="rounded-sm border border-ink px-5 py-2.5 text-sm font-medium text-ink hover:bg-ink hover:text-surface"
        >
          Review submissions
        </Link>
      </div>
    </>
  );
}
