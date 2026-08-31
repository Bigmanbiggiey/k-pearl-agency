import { Seo } from '@/components/Seo';
import { Container, PageHeader, Section } from '@/components/ui';
import { LIST_PROPERTY } from '@/content/listProperty';
import { ListPropertyForm } from '@/features/lead-forms';

export default function ListYourPropertyPage() {
  return (
    <>
      <Seo
        title="List your property"
        description="Have a property to let or sell in Nairobi? Submit the details and K Pearl Agency will follow up to prepare and market the listing."
        path="/list-your-property"
      />
      <PageHeader
        eyebrow={LIST_PROPERTY.eyebrow}
        title={LIST_PROPERTY.title}
        lede={LIST_PROPERTY.lede}
      />

      <Section>
        <Container className="grid gap-12 px-0 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <ul className="space-y-3">
              {LIST_PROPERTY.points.map((point) => (
                <li key={point} className="flex gap-3 text-sm text-charcoal">
                  <span aria-hidden="true" className="mt-1 text-gold">
                    ✦
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-md border border-line bg-ivory p-6">
            <ListPropertyForm />
          </div>
        </Container>
      </Section>
    </>
  );
}
