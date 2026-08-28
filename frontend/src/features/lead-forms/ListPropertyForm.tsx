import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { emptyToUndefined, numberOrUndefined } from './coerce';
import { ConsentField } from './ConsentField';
import { Honeypot } from './Honeypot';
import { LeadFormSuccess } from './LeadFormSuccess';
import { useLeadSubmit } from './useLeadSubmit';

import { FormField, SelectInput, TextArea, TextInput } from '@/components/ui';
import { groupAreasByCounty, useAreas, useCreatePropertySubmission } from '@/hooks';
import { LISTING_TYPES, propertyTypeLabel, PROPERTY_TYPES, listingTypeLabel } from '@/lib/format';
import { propertySubmissionSchema, type PropertySubmissionInput } from '@/schemas';

export function ListPropertyForm() {
  const { data: areas } = useAreas();
  const grouped = groupAreasByCounty(areas ?? []);
  const mutation = useCreatePropertySubmission();
  const { status, errorMessage, run } = useLeadSubmit<PropertySubmissionInput>((v) =>
    mutation.mutateAsync(v),
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PropertySubmissionInput>({
    resolver: zodResolver(propertySubmissionSchema),
    defaultValues: {
      submitterName: '',
      submitterPhone: '',
      submitterEmail: '',
      submitterNotes: '',
      proposedTitle: '',
      proposedDescription: '',
      company: '',
    },
  });

  if (status === 'success') {
    return (
      <LeadFormSuccess title="Thanks — we&rsquo;ve got your property.">
        Our team will review the details and get in touch to prepare the listing. Nothing is
        published until we&rsquo;ve spoken.
      </LeadFormSuccess>
    );
  }

  return (
    <form onSubmit={(e) => void handleSubmit(run)(e)} className="space-y-6" noValidate>
      <Honeypot field={register('company')} />

      <div className="space-y-4">
        <h2 className="text-lg">Your details</h2>
        <FormField
          label="Your name"
          htmlFor="lp-name"
          required
          error={errors.submitterName?.message}
        >
          <TextInput
            id="lp-name"
            autoComplete="name"
            aria-invalid={errors.submitterName ? 'true' : undefined}
            {...register('submitterName')}
          />
        </FormField>
        <FormField
          label="Phone number"
          htmlFor="lp-phone"
          required
          hint="Kenyan number, e.g. 0712 345678"
          error={errors.submitterPhone?.message}
        >
          <TextInput
            id="lp-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            aria-invalid={errors.submitterPhone ? 'true' : undefined}
            {...register('submitterPhone')}
          />
        </FormField>
        <FormField
          label="Email address (optional)"
          htmlFor="lp-email"
          error={errors.submitterEmail?.message}
        >
          <TextInput id="lp-email" type="email" inputMode="email" {...register('submitterEmail')} />
        </FormField>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg">About the property</h2>
        <FormField
          label="Title"
          htmlFor="lp-title"
          required
          hint="e.g. 3-bed apartment in Kilimani"
          error={errors.proposedTitle?.message}
        >
          <TextInput
            id="lp-title"
            aria-invalid={errors.proposedTitle ? 'true' : undefined}
            {...register('proposedTitle')}
          />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Listing type"
            htmlFor="lp-listing"
            required
            error={errors.proposedListingType?.message}
          >
            <SelectInput id="lp-listing" defaultValue="" {...register('proposedListingType')}>
              <option value="" disabled>
                Select…
              </option>
              {LISTING_TYPES.map((t) => (
                <option key={t} value={t}>
                  {listingTypeLabel(t)}
                </option>
              ))}
            </SelectInput>
          </FormField>
          <FormField
            label="Property type"
            htmlFor="lp-type"
            required
            error={errors.proposedPropertyType?.message}
          >
            <SelectInput id="lp-type" defaultValue="" {...register('proposedPropertyType')}>
              <option value="" disabled>
                Select…
              </option>
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {propertyTypeLabel(t)}
                </option>
              ))}
            </SelectInput>
          </FormField>
        </div>

        <FormField label="Area (optional)" htmlFor="lp-area" error={errors.proposedAreaId?.message}>
          <SelectInput
            id="lp-area"
            defaultValue=""
            {...register('proposedAreaId', { setValueAs: emptyToUndefined })}
          >
            <option value="">Not sure / not listed</option>
            {grouped.map((group) => (
              <optgroup key={group.county} label={group.county}>
                {group.areas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </SelectInput>
        </FormField>

        <div className="grid gap-4 sm:grid-cols-3">
          <FormField
            label="Price (KES, optional)"
            htmlFor="lp-price"
            error={errors.proposedPrice?.message}
          >
            <TextInput
              id="lp-price"
              type="number"
              min="0"
              step="1000"
              inputMode="numeric"
              {...register('proposedPrice', { setValueAs: numberOrUndefined })}
            />
          </FormField>
          <FormField
            label="Bedrooms (optional)"
            htmlFor="lp-beds"
            error={errors.proposedBedrooms?.message}
          >
            <TextInput
              id="lp-beds"
              type="number"
              min="0"
              inputMode="numeric"
              {...register('proposedBedrooms', { setValueAs: numberOrUndefined })}
            />
          </FormField>
          <FormField
            label="Bathrooms (optional)"
            htmlFor="lp-baths"
            error={errors.proposedBathrooms?.message}
          >
            <TextInput
              id="lp-baths"
              type="number"
              min="0"
              step="0.5"
              inputMode="numeric"
              {...register('proposedBathrooms', { setValueAs: numberOrUndefined })}
            />
          </FormField>
        </div>

        <FormField
          label="Description / notes (optional)"
          htmlFor="lp-desc"
          error={errors.proposedDescription?.message}
        >
          <TextArea id="lp-desc" {...register('proposedDescription')} />
        </FormField>
      </div>

      <ConsentField field={register('consent')} error={errors.consent?.message} />

      {status === 'error' ? (
        <p className="text-sm text-danger" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="rounded-sm bg-gold px-6 py-2.5 text-sm font-medium text-ink hover:bg-gold-deep disabled:opacity-60"
      >
        {status === 'submitting' ? 'Sending…' : 'Submit property'}
      </button>
    </form>
  );
}
