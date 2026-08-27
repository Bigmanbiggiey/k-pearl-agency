import { Seo } from '@/components/Seo';
import { PagePlaceholder } from '@/pages/PagePlaceholder';

export default function PropertiesPage() {
  return (
    <>
      <Seo
        title="Properties"
        description="Browse properties to rent and buy across Nairobi and its environs with K Pearl Agency."
        path="/properties"
      />
      <PagePlaceholder title="Properties" phase="Phase 4 · Property catalogue">
        <p>
          The full catalogue — search, filters, pagination — is built in Phase 4. The homepage
          already shows featured and latest listings.
        </p>
      </PagePlaceholder>
    </>
  );
}
