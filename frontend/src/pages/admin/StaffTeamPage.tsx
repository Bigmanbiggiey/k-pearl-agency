import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Seo } from '@/components/Seo';
import { FormField, TextInput } from '@/components/ui';
import { useAuth } from '@/features/auth';
import { useStaffProfiles } from '@/features/staff/hooks';
import { useTeamActions } from '@/features/staff/settingsHooks';
import { EmptyState } from '@/features/staff/ui';
import type { Profile } from '@/repositories';
import { inviteStaffSchema, type InviteStaffInput } from '@/schemas';
import type { StaffRole } from '@/types';

function TeamRow({ profile }: { profile: Profile }) {
  const { user } = useAuth();
  const { updateProfile, setRole } = useTeamActions();
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(profile.fullName);
  const [phone, setPhone] = useState(profile.phone ?? '');
  const [whatsapp, setWhatsapp] = useState(profile.whatsapp ?? '');

  const save = async () => {
    await updateProfile.mutateAsync({ id: profile.id, fullName, phone, whatsapp });
    setEditing(false);
  };

  return (
    <li className="space-y-2 px-3 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm">
          <span className="font-medium">{profile.fullName || '(no name)'}</span>
          <span className="ml-2 text-xs text-muted">{profile.whatsapp ?? '—'}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <select
            value={profile.role}
            onChange={(e) => setRole.mutate({ id: profile.id, role: e.target.value as StaffRole })}
            disabled={profile.id === user?.id}
            className="rounded-sm border border-line bg-ivory px-2 py-1"
          >
            <option value="agent">agent</option>
            <option value="admin">admin</option>
          </select>
          <button
            type="button"
            onClick={() => setEditing((v) => !v)}
            className="rounded-sm border border-line px-2 py-1 hover:border-gold"
          >
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>
      </div>

      {editing ? (
        <div className="grid gap-2 sm:grid-cols-3">
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full name"
            className="rounded-sm border border-line bg-surface px-2 py-1.5 text-sm"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone"
            className="rounded-sm border border-line bg-surface px-2 py-1.5 text-sm"
          />
          <input
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="WhatsApp"
            className="rounded-sm border border-line bg-surface px-2 py-1.5 text-sm"
          />
          <button
            type="button"
            onClick={() => void save()}
            disabled={updateProfile.isPending}
            className="rounded-sm bg-gold px-3 py-1.5 text-sm font-medium text-ink hover:bg-gold-deep disabled:opacity-60"
          >
            Save
          </button>
        </div>
      ) : null}
    </li>
  );
}

function InviteForm() {
  const { invite } = useTeamActions();
  const [done, setDone] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InviteStaffInput>({
    resolver: zodResolver(inviteStaffSchema),
    defaultValues: { email: '', fullName: '', role: 'agent' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setDone(null);
    await invite.mutateAsync(values);
    setDone(`Invite sent to ${values.email}.`);
    reset({ email: '', fullName: '', role: 'agent' });
  });

  return (
    <form onSubmit={(e) => void onSubmit(e)} noValidate className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <FormField label="Email" htmlFor="inv-email" error={errors.email?.message}>
          <TextInput id="inv-email" type="email" {...register('email')} />
        </FormField>
        <FormField label="Full name" htmlFor="inv-name" error={errors.fullName?.message}>
          <TextInput id="inv-name" {...register('fullName')} />
        </FormField>
        <FormField label="Role" htmlFor="inv-role" error={errors.role?.message}>
          <select
            id="inv-role"
            {...register('role')}
            className="w-full rounded-sm border border-line bg-ivory px-3 py-2.5 text-sm"
          >
            <option value="agent">agent</option>
            <option value="admin">admin</option>
          </select>
        </FormField>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-sm border border-ink px-4 py-2 text-sm font-medium hover:bg-ink hover:text-surface disabled:opacity-60"
      >
        {isSubmitting ? 'Sending…' : 'Send invite'}
      </button>
      {invite.isError ? (
        <p className="text-sm text-danger" role="alert">
          {invite.error.message}
        </p>
      ) : null}
      {done ? <p className="text-sm text-success">{done}</p> : null}
    </form>
  );
}

export default function StaffTeamPage() {
  const { data: profiles = [], isLoading } = useStaffProfiles();

  return (
    <>
      <Seo title="Team" description="Staff accounts." path="/staff/team" noindex />
      <h1 className="text-2xl">Team</h1>

      <section className="mt-6 max-w-2xl">
        {isLoading ? (
          <p className="text-sm text-muted">Loading…</p>
        ) : profiles.length === 0 ? (
          <EmptyState>No staff accounts.</EmptyState>
        ) : (
          <ul className="divide-y divide-line rounded-md border border-line">
            {profiles.map((p) => (
              <TeamRow key={p.id} profile={p} />
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10 max-w-2xl">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted">Invite staff</h2>
        <p className="mt-1 text-xs text-muted">
          Sends a Supabase invite email. The person sets a password via the staff reset link.
        </p>
        <div className="mt-3">
          <InviteForm />
        </div>
      </section>
    </>
  );
}
