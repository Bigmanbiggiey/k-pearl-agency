import { Seo } from '@/components/Seo';
import { PagePlaceholder } from '@/pages/PagePlaceholder';

export default function StaffLoginPage() {
  return (
    <>
      <Seo
        title="Staff sign in"
        description="K Pearl Agency staff sign in."
        path="/staff/login"
        noindex
      />
      <PagePlaceholder title="Staff sign in" phase="Phase 6 · Staff dashboard">
        <p>Email + password via Supabase Auth (staff only, ADR-005). Built in Phase 6.</p>
      </PagePlaceholder>
    </>
  );
}
