import { useParams } from 'react-router-dom';

import { PagePlaceholder } from '@/pages/PagePlaceholder';

export function PropertyDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  return (
    <PagePlaceholder title="Property detail" phase="Phase 4 · Property catalogue">
      <p>
        Detail page for <code>{slug}</code>. Gallery, key facts, description, amenities, enquiry and
        viewing CTAs are built in Phase 4.
      </p>
    </PagePlaceholder>
  );
}
