import { Seo } from '@/components/Seo';
import { PagePlaceholder } from '@/pages/PagePlaceholder';

export default function ListYourPropertyPage() {
  return (
    <>
      <Seo
        title="List your property"
        description="Have a property to let or sell in Nairobi? Submit the details and K Pearl Agency will follow up to prepare and market the listing."
        path="/list-your-property"
      />
      <PagePlaceholder title="List your property" phase="Phase 5 · Lead generation">
        <p>
          A short form to tell us about your property. Submissions go to our team’s review queue —
          nothing is published automatically — and an agent follows up to prepare the listing.
        </p>
      </PagePlaceholder>
    </>
  );
}
