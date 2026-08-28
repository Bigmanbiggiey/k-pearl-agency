import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Seo } from '@/components/Seo';
import { Checkbox, FormField, TextInput } from '@/components/ui';
import { useAllAreas, useAreaActions, useUpdateSiteSettings } from '@/features/staff/settingsHooks';
import { EmptyState } from '@/features/staff/ui';
import { useSiteSettings } from '@/hooks';
import { siteSettingsSchema, type SiteSettingsInput } from '@/schemas';
import { slugify } from '@/services';

function SiteSettingsForm() {
  const { data: settings, isLoading } = useSiteSettings();
  const mutation = useUpdateSiteSettings();
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<SiteSettingsInput>({ resolver: zodResolver(siteSettingsSchema) });

  useEffect(() => {
    if (settings) reset(settings);
  }, [settings, reset]);

  const onSubmit = handleSubmit(async (values) => {
    setSaved(false);
    await mutation.mutateAsync(values);
    setSaved(true);
  });

  if (isLoading || !settings) return <p className="text-sm text-muted">Loading…</p>;

  return (
    <form onSubmit={(e) => void onSubmit(e)} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Phone" htmlFor="s-phone" error={errors.phone?.message}>
          <TextInput id="s-phone" type="tel" {...register('phone')} />
        </FormField>
        <FormField label="WhatsApp" htmlFor="s-whatsapp" error={errors.whatsapp?.message}>
          <TextInput id="s-whatsapp" type="tel" {...register('whatsapp')} />
        </FormField>
      </div>
      <FormField label="Email" htmlFor="s-email" error={errors.email?.message}>
        <TextInput id="s-email" type="email" {...register('email')} />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Weekday hours" htmlFor="s-weekday" error={errors.hoursWeekday?.message}>
          <TextInput id="s-weekday" {...register('hoursWeekday')} />
        </FormField>
        <FormField label="Weekend hours" htmlFor="s-weekend" error={errors.hoursWeekend?.message}>
          <TextInput id="s-weekend" {...register('hoursWeekend')} />
        </FormField>
      </div>
      <Checkbox label="Viewings by appointment" {...register('byAppointment')} />

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="rounded-sm bg-gold px-5 py-2 text-sm font-medium text-ink hover:bg-gold-deep disabled:opacity-60"
        >
          {isSubmitting ? 'Saving…' : 'Save settings'}
        </button>
        {saved ? <span className="text-xs text-success">Saved.</span> : null}
      </div>
    </form>
  );
}

function AreasManager() {
  const { data: areas = [], isLoading } = useAllAreas();
  const { create, setActive } = useAreaActions();
  const [county, setCounty] = useState('');
  const [name, setName] = useState('');

  const add = async () => {
    if (county.trim().length < 2 || name.trim().length < 2) return;
    await create.mutateAsync({
      county: county.trim(),
      name: name.trim(),
      slug: slugify(name),
      sortOrder: areas.length,
    });
    setCounty('');
    setName('');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <label className="text-sm">
          <span className="mb-1 block text-xs uppercase tracking-wider text-muted">County</span>
          <input
            value={county}
            onChange={(e) => setCounty(e.target.value)}
            className="rounded-sm border border-line bg-ivory px-2 py-1.5 text-sm"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-xs uppercase tracking-wider text-muted">Area name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-sm border border-line bg-ivory px-2 py-1.5 text-sm"
          />
        </label>
        <button
          type="button"
          onClick={() => void add()}
          disabled={create.isPending}
          className="rounded-sm border border-ink px-3 py-1.5 text-sm hover:bg-ink hover:text-surface disabled:opacity-60"
        >
          Add area
        </button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : areas.length === 0 ? (
        <EmptyState>No areas yet.</EmptyState>
      ) : (
        <ul className="divide-y divide-line rounded-md border border-line">
          {areas.map((area) => (
            <li
              key={area.id}
              className="flex flex-wrap items-center justify-between gap-2 px-3 py-2"
            >
              <span className="text-sm">
                <span className="text-muted">{area.county} · </span>
                {area.name}
                {!area.isActive ? (
                  <span className="ml-2 text-xs text-muted">(inactive)</span>
                ) : null}
              </span>
              <button
                type="button"
                onClick={() => setActive.mutate({ id: area.id, isActive: !area.isActive })}
                className="rounded-sm border border-line px-2 py-0.5 text-xs hover:border-gold"
              >
                {area.isActive ? 'Deactivate' : 'Activate'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function StaffSettingsPage() {
  return (
    <>
      <Seo title="Settings" description="Site settings." path="/staff/settings" noindex />
      <h1 className="text-2xl">Settings</h1>

      <section className="mt-6 max-w-2xl">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted">Public contact</h2>
        <div className="mt-3">
          <SiteSettingsForm />
        </div>
      </section>

      <section className="mt-10 max-w-2xl">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted">Service areas</h2>
        <div className="mt-3">
          <AreasManager />
        </div>
      </section>
    </>
  );
}
