import { Link, useParams } from 'react-router-dom';

import { RouteFallback } from '@/components/layout/RouteFallback';
import { PropertyGallery } from '@/components/property/PropertyGallery';
import { Seo } from '@/components/Seo';
import { Container, Section } from '@/components/ui';
import { EnquiryForm, LeadDialog, ViewingRequestForm } from '@/features/lead-forms';
import { useProperty, useSiteSettings } from '@/hooks';
import { telHref, whatsappHref } from '@/lib/contact';
import { amenityLabel, formatPrice, listingTypeLabel, propertyTypeLabel } from '@/lib/format';
import { propertyJsonLd } from '@/lib/seo';
import NotFoundPage from '@/pages/public/NotFoundPage';

export default function PropertyDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: property, isLoading, isError } = useProperty(slug);
  const { data: settings } = useSiteSettings();

  if (isLoading) return <RouteFallback />;
  if (isError) {
    return (
      <Container className="py-24 text-center text-muted">
        We couldn’t load this property. Please try again.
      </Container>
    );
  }
  if (!property) return <NotFoundPage />;

  const location = [property.areaName, property.areaCounty].filter(Boolean).join(', ');
  const facts: Array<{ label: string; value: string }> = [
    { label: 'Listing', value: listingTypeLabel(property.listingType) },
    { label: 'Type', value: propertyTypeLabel(property.propertyType) },
  ];
  if (property.bedrooms != null)
    facts.push({ label: 'Bedrooms', value: String(property.bedrooms) });
  if (property.bathrooms != null)
    facts.push({ label: 'Bathrooms', value: String(property.bathrooms) });
  if (property.sizeValue != null)
    facts.push({ label: 'Size', value: `${property.sizeValue} ${property.sizeUnit ?? ''}`.trim() });
  if (property.availableFrom)
    facts.push({ label: 'Available from', value: property.availableFrom });

  const waMessage = `Hi K Pearl, I'm interested in ${property.referenceCode} — ${property.title}.`;

  return (
    <>
      <Seo
        title={property.title}
        description={
          property.description.slice(0, 155) ||
          `${listingTypeLabel(property.listingType)} — ${propertyTypeLabel(property.propertyType)} in ${location || 'Nairobi'}.`
        }
        path={`/properties/${property.slug}`}
        type="article"
        jsonLd={propertyJsonLd(property)}
      />

      <Container className="py-8">
        <Link to="/properties" className="text-sm text-gold-deep underline underline-offset-4">
          ← All properties
        </Link>
      </Container>

      <Container>
        <PropertyGallery
          media={property.media}
          propertyType={property.propertyType}
          title={property.title}
        />
      </Container>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">
              {property.referenceCode}
            </p>
            <h1 className="mt-2 text-3xl sm:text-4xl">{property.title}</h1>
            {location ? <p className="mt-2 text-muted">{location}</p> : null}
            <p className="mt-4 text-2xl font-semibold text-gold-deep">
              {formatPrice(property.price, property.currency, property.pricePeriod)}
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-xs uppercase tracking-wider text-muted">{fact.label}</dt>
                  <dd className="mt-1 text-charcoal">{fact.value}</dd>
                </div>
              ))}
            </dl>

            {property.description ? (
              <div className="mt-10">
                <h2 className="text-xl">Description</h2>
                <p className="mt-3 whitespace-pre-line text-charcoal">{property.description}</p>
              </div>
            ) : null}

            {property.amenities.length > 0 ? (
              <div className="mt-10">
                <h2 className="text-xl">Amenities</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {property.amenities.map((amenity) => (
                    <li
                      key={amenity}
                      className="rounded-full border border-line bg-ivory px-3 py-1 text-sm text-charcoal"
                    >
                      {amenityLabel(amenity)}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          {/* Contact rail */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-md border border-line bg-ivory p-6">
              <p className="font-display text-lg">Interested in this property?</p>
              <p className="mt-1 text-sm text-muted">
                Quote reference {property.referenceCode} when you get in touch.
              </p>
              <div className="mt-5 flex flex-col gap-3">
                <LeadDialog
                  triggerLabel="Enquire about this property"
                  title={`Enquire — ${property.referenceCode}`}
                >
                  <EnquiryForm
                    type="property_enquiry"
                    propertyId={property.id}
                    reference={property.referenceCode}
                  />
                </LeadDialog>
                <LeadDialog
                  triggerLabel="Request a viewing"
                  triggerVariant="secondary"
                  title={`Request a viewing — ${property.referenceCode}`}
                >
                  <ViewingRequestForm propertyId={property.id} reference={property.referenceCode} />
                </LeadDialog>
                {settings ? (
                  <div className="mt-1 flex flex-col gap-2 border-t border-line pt-3 text-sm">
                    <a
                      href={whatsappHref(settings.whatsapp, waMessage)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-gold-deep underline underline-offset-4"
                    >
                      …or message us on WhatsApp
                    </a>
                    <a
                      href={telHref(settings.phone)}
                      className="text-gold-deep underline underline-offset-4"
                    >
                      …or call {settings.phone}
                    </a>
                  </div>
                ) : null}
              </div>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
