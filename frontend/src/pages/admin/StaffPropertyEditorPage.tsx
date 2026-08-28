import { zodResolver } from '@hookform/resolvers/zod';
import * as Tabs from '@radix-ui/react-tabs';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import { Seo } from '@/components/Seo';
import { FormField, SelectInput, TextArea, TextInput } from '@/components/ui';
import { useAuth } from '@/features/auth';
import { numberOrNull } from '@/features/staff/coerce';
import {
  useCreateProperty,
  usePropertyLifecycle,
  useStaffProperty,
  useStaffProfiles,
  useUpdateProperty,
} from '@/features/staff/hooks';
import { ConfirmButton, MediaManager, SaveBar, StatusBadge } from '@/features/staff/ui';
import { useAreas, groupAreasByCounty } from '@/hooks';
import {
  AMENITIES,
  amenityLabel,
  LISTING_TYPES,
  listingTypeLabel,
  PRICE_PERIODS,
  PROPERTY_STATUSES,
  PROPERTY_TYPES,
  propertyTypeLabel,
  SIZE_UNITS,
  statusLabel,
} from '@/lib/format';
import { propertyFormSchema, type PropertyFormValues } from '@/schemas';
import type { PropertyStatus, StaffPropertyDetail } from '@/types';

const EMPTY: PropertyFormValues = {
  title: '',
  slug: '',
  listingType: 'rent',
  pricePeriod: 'month',
  propertyType: 'apartment',
  priceOnRequest: false,
  price: null,
  currency: 'KES',
  areaId: null,
  bedrooms: null,
  bathrooms: null,
  sizeValue: null,
  sizeUnit: null,
  description: '',
  amenities: [],
  availableFrom: '',
  addressLine: '',
  latitude: null,
  longitude: null,
  ownerName: '',
  ownerPhone: '',
  ownerEmail: '',
  status: 'draft',
  agentId: null,
  featured: false,
  verified: false,
};

function toForm(p: StaffPropertyDetail): PropertyFormValues {
  return {
    title: p.title,
    slug: p.slug,
    listingType: p.listingType,
    pricePeriod: p.pricePeriod,
    propertyType: p.propertyType,
    priceOnRequest: p.price === null,
    price: p.price,
    currency: 'KES',
    areaId: p.areaId,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    sizeValue: p.sizeValue,
    sizeUnit: (p.sizeUnit as PropertyFormValues['sizeUnit']) ?? null,
    description: p.description,
    amenities: p.amenities,
    availableFrom: p.availableFrom ?? '',
    addressLine: p.addressLine ?? '',
    latitude: p.latitude,
    longitude: p.longitude,
    ownerName: p.ownerName ?? '',
    ownerPhone: p.ownerPhone ?? '',
    ownerEmail: p.ownerEmail ?? '',
    status: p.status,
    agentId: p.agentId,
    featured: p.featured,
    verified: p.verified,
  };
}

const nullableSelect = (value: string): string | null => (value === '' ? null : value);

export default function StaffPropertyEditorPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id;
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const { data: record, isLoading } = useStaffProperty(id);
  const { data: areas = [] } = useAreas();
  const { data: profiles = [] } = useStaffProfiles();
  const grouped = groupAreasByCounty(areas);

  const createMutation = useCreateProperty();
  const updateMutation = useUpdateProperty(id ?? '');
  const lifecycle = usePropertyLifecycle(id ?? '');

  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: EMPTY,
  });

  useEffect(() => {
    if (record) reset(toForm(record));
  }, [record, reset]);

  const listingType = useWatch({ control, name: 'listingType' });
  const priceOnRequest = useWatch({ control, name: 'priceOnRequest' });

  useEffect(() => {
    if (listingType === 'sale') setValue('pricePeriod', null, { shouldDirty: true });
  }, [listingType, setValue]);

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      if (isNew) {
        const newId = await createMutation.mutateAsync(values);
        void navigate(`/staff/properties/${newId}`, { replace: true });
      } else {
        await updateMutation.mutateAsync(values);
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Could not save the property.');
    }
  });

  const runStatus = (status: PropertyStatus) => lifecycle.setStatus.mutate(status);

  if (!isNew && isLoading) return <p className="text-sm text-muted">Loading…</p>;
  if (!isNew && !record) return <p className="text-sm text-muted">Property not found.</p>;

  return (
    <>
      <Seo
        title={isNew ? 'New property' : (record?.title ?? 'Edit property')}
        description="Property editor."
        path="/staff/properties"
        noindex
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl">{isNew ? 'New property' : record?.title}</h1>
        {record ? <StatusBadge status={record.status} /> : null}
      </div>

      <form onSubmit={(e) => void onSubmit(e)} noValidate className="mt-6">
        <Tabs.Root defaultValue="details">
          <Tabs.List className="flex flex-wrap gap-1 border-b border-line">
            {(
              [
                ['details', 'Details'],
                ['location', 'Location & owner'],
                ['media', 'Media'],
                ['publishing', 'Publishing'],
              ] as const
            ).map(([value, label]) => (
              <Tabs.Trigger
                key={value}
                value={value}
                className="rounded-t-sm px-3 py-2 text-sm text-charcoal data-[state=active]:border-b-2 data-[state=active]:border-gold data-[state=active]:font-medium data-[state=active]:text-ink"
              >
                {label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          {/* ── Details ─────────────────────────────────────────── */}
          <Tabs.Content value="details" className="space-y-4 pt-6">
            <FormField label="Title" htmlFor="p-title" required error={errors.title?.message}>
              <TextInput id="p-title" {...register('title')} />
            </FormField>
            <FormField
              label="Slug"
              htmlFor="p-slug"
              hint="Lowercase, hyphenated. Leave blank to generate from the title."
              error={errors.slug?.message}
            >
              <TextInput id="p-slug" {...register('slug')} />
            </FormField>

            <div className="grid gap-4 sm:grid-cols-3">
              <FormField
                label="Listing type"
                htmlFor="p-listing"
                error={errors.listingType?.message}
              >
                <SelectInput id="p-listing" {...register('listingType')}>
                  {LISTING_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {listingTypeLabel(t)}
                    </option>
                  ))}
                </SelectInput>
              </FormField>
              <FormField label="Rate period" htmlFor="p-period" error={errors.pricePeriod?.message}>
                <SelectInput
                  id="p-period"
                  disabled={listingType === 'sale'}
                  {...register('pricePeriod', { setValueAs: nullableSelect })}
                >
                  <option value="">None</option>
                  {PRICE_PERIODS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </SelectInput>
              </FormField>
              <FormField
                label="Property type"
                htmlFor="p-type"
                error={errors.propertyType?.message}
              >
                <SelectInput id="p-type" {...register('propertyType')}>
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {propertyTypeLabel(t)}
                    </option>
                  ))}
                </SelectInput>
              </FormField>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <FormField label="Price (KES)" htmlFor="p-price" error={errors.price?.message}>
                <TextInput
                  id="p-price"
                  type="number"
                  min="0"
                  step="1000"
                  disabled={priceOnRequest}
                  {...register('price', { setValueAs: numberOrNull })}
                />
              </FormField>
              <label className="flex items-center gap-2 pt-7 text-sm text-charcoal">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-gold"
                  {...register('priceOnRequest')}
                />
                Price on request
              </label>
              <FormField
                label="Available from"
                htmlFor="p-available"
                error={errors.availableFrom?.message}
              >
                <TextInput id="p-available" type="date" {...register('availableFrom')} />
              </FormField>
            </div>

            <div className="grid gap-4 sm:grid-cols-4">
              <FormField label="Bedrooms" htmlFor="p-beds" error={errors.bedrooms?.message}>
                <TextInput
                  id="p-beds"
                  type="number"
                  min="0"
                  {...register('bedrooms', { setValueAs: numberOrNull })}
                />
              </FormField>
              <FormField label="Bathrooms" htmlFor="p-baths" error={errors.bathrooms?.message}>
                <TextInput
                  id="p-baths"
                  type="number"
                  min="0"
                  step="0.5"
                  {...register('bathrooms', { setValueAs: numberOrNull })}
                />
              </FormField>
              <FormField label="Size" htmlFor="p-size" error={errors.sizeValue?.message}>
                <TextInput
                  id="p-size"
                  type="number"
                  min="0"
                  step="0.01"
                  {...register('sizeValue', { setValueAs: numberOrNull })}
                />
              </FormField>
              <FormField label="Size unit" htmlFor="p-size-unit" error={errors.sizeUnit?.message}>
                <SelectInput
                  id="p-size-unit"
                  {...register('sizeUnit', { setValueAs: nullableSelect })}
                >
                  <option value="">—</option>
                  {SIZE_UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </SelectInput>
              </FormField>
            </div>

            <FormField label="Area" htmlFor="p-area" error={errors.areaId?.message}>
              <SelectInput id="p-area" {...register('areaId', { setValueAs: nullableSelect })}>
                <option value="">Unassigned</option>
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

            <FormField label="Description" htmlFor="p-desc" error={errors.description?.message}>
              <TextArea id="p-desc" rows={6} {...register('description')} />
            </FormField>

            <fieldset>
              <legend className="mb-2 text-sm font-medium text-charcoal">Amenities</legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {AMENITIES.map((a) => (
                  <label key={a} className="flex items-center gap-2 text-sm text-charcoal">
                    <input
                      type="checkbox"
                      value={a}
                      className="h-4 w-4 accent-gold"
                      {...register('amenities')}
                    />
                    {amenityLabel(a)}
                  </label>
                ))}
              </div>
            </fieldset>
          </Tabs.Content>

          {/* ── Location & owner ────────────────────────────────── */}
          <Tabs.Content value="location" className="space-y-4 pt-6">
            <p className="text-xs text-muted">
              These details are staff-only and never shown publicly.
            </p>
            <FormField label="Address line" htmlFor="p-address" error={errors.addressLine?.message}>
              <TextInput id="p-address" {...register('addressLine')} />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Latitude" htmlFor="p-lat" error={errors.latitude?.message}>
                <TextInput
                  id="p-lat"
                  type="number"
                  step="0.000001"
                  {...register('latitude', { setValueAs: numberOrNull })}
                />
              </FormField>
              <FormField label="Longitude" htmlFor="p-lng" error={errors.longitude?.message}>
                <TextInput
                  id="p-lng"
                  type="number"
                  step="0.000001"
                  {...register('longitude', { setValueAs: numberOrNull })}
                />
              </FormField>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <FormField label="Owner name" htmlFor="p-owner" error={errors.ownerName?.message}>
                <TextInput id="p-owner" {...register('ownerName')} />
              </FormField>
              <FormField
                label="Owner phone"
                htmlFor="p-owner-phone"
                error={errors.ownerPhone?.message}
              >
                <TextInput id="p-owner-phone" type="tel" {...register('ownerPhone')} />
              </FormField>
              <FormField
                label="Owner email"
                htmlFor="p-owner-email"
                error={errors.ownerEmail?.message}
              >
                <TextInput id="p-owner-email" type="email" {...register('ownerEmail')} />
              </FormField>
            </div>
          </Tabs.Content>

          {/* ── Media ───────────────────────────────────────────── */}
          <Tabs.Content value="media" className="pt-6">
            {isNew ? (
              <p className="rounded-md border border-line bg-ivory p-6 text-sm text-muted">
                Save the listing first, then add photos here.
              </p>
            ) : (
              <MediaManager propertyId={id ?? ''} />
            )}
          </Tabs.Content>

          {/* ── Publishing ──────────────────────────────────────── */}
          <Tabs.Content value="publishing" className="space-y-6 pt-6">
            <FormField
              label="Status (saved with the form)"
              htmlFor="p-status"
              error={errors.status?.message}
            >
              <SelectInput id="p-status" {...register('status')}>
                {PROPERTY_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {statusLabel(s)}
                  </option>
                ))}
              </SelectInput>
            </FormField>

            {!isNew && record ? (
              <div className="space-y-3">
                <p className="text-sm text-muted">Quick actions apply immediately:</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => runStatus('published')}
                    className="rounded-sm border border-line px-3 py-1.5 text-sm hover:border-gold"
                  >
                    Publish
                  </button>
                  <button
                    type="button"
                    onClick={() => runStatus('draft')}
                    className="rounded-sm border border-line px-3 py-1.5 text-sm hover:border-gold"
                  >
                    Move to draft
                  </button>
                  <button
                    type="button"
                    onClick={() => runStatus('unavailable')}
                    className="rounded-sm border border-line px-3 py-1.5 text-sm hover:border-gold"
                  >
                    Mark unavailable
                  </button>
                  <button
                    type="button"
                    onClick={() => runStatus('let_or_sold')}
                    className="rounded-sm border border-line px-3 py-1.5 text-sm hover:border-gold"
                  >
                    Mark let / sold
                  </button>
                  <ConfirmButton
                    triggerLabel="Archive"
                    title="Archive this property?"
                    description="It will be hidden from the public site and staff lists filtered to active listings."
                    confirmLabel="Archive"
                    onConfirm={() => runStatus('archived')}
                  />
                </div>
              </div>
            ) : null}

            {isAdmin ? (
              <div className="space-y-4 border-t border-line pt-4">
                <FormField label="Assigned agent" htmlFor="p-agent" error={errors.agentId?.message}>
                  <SelectInput
                    id="p-agent"
                    {...register('agentId', { setValueAs: nullableSelect })}
                  >
                    <option value="">Unassigned</option>
                    {profiles.map((pr) => (
                      <option key={pr.id} value={pr.id}>
                        {pr.fullName || pr.id} ({pr.role})
                      </option>
                    ))}
                  </SelectInput>
                </FormField>
                <label className="flex items-center gap-2 text-sm text-charcoal">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-gold"
                    {...register('featured')}
                  />
                  Featured on the home page
                </label>
                <label className="flex items-center gap-2 text-sm text-charcoal">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-gold"
                    {...register('verified')}
                  />
                  Verified listing
                </label>
              </div>
            ) : (
              <p className="border-t border-line pt-4 text-xs text-muted">
                Agent assignment and featured / verified flags are set by an administrator.
              </p>
            )}
          </Tabs.Content>
        </Tabs.Root>

        <SaveBar
          dirty={isNew || isDirty}
          saving={isSubmitting}
          onSave={() => void onSubmit()}
          message={formError}
        />
      </form>
    </>
  );
}
