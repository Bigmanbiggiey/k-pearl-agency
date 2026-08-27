import { Seo } from '@/components/Seo';
import { PagePlaceholder } from '@/pages/PagePlaceholder';

export default function StaffDashboardPage() {
  return (
    <>
      <Seo title="Dashboard" description="K Pearl Agency staff dashboard." path="/staff" noindex />
      <PagePlaceholder title="Dashboard" phase="Phase 6 · Staff dashboard">
        <p>
          Property counts, new inquiries and viewing requests, recent activity. Built in Phase 6.
        </p>
      </PagePlaceholder>
    </>
  );
}
