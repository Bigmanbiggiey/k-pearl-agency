import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { StaffAuthShell } from './StaffAuthShell';

import { FormField, TextInput } from '@/components/ui';
import { authRepository } from '@/repositories';
import { setPasswordSchema, type SetPasswordInput } from '@/schemas';

/**
 * Serves both the password-recovery link and the staff-invite link. Supabase
 * puts a session in the URL (`detectSessionInUrl`), so the user is already
 * authenticated here and just needs to set a password.
 */
export default function StaffResetPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SetPasswordInput>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: { password: '', confirm: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    try {
      await authRepository.updatePassword(values.password);
      void navigate('/staff', { replace: true });
    } catch {
      setError('Could not set the password. The link may have expired — request a new one.');
    }
  });

  return (
    <StaffAuthShell title="Set your password">
      <form onSubmit={(e) => void onSubmit(e)} className="space-y-4" noValidate>
        <FormField label="New password" htmlFor="reset-password" error={errors.password?.message}>
          <TextInput
            id="reset-password"
            type="password"
            autoComplete="new-password"
            {...register('password')}
          />
        </FormField>
        <FormField label="Confirm password" htmlFor="reset-confirm" error={errors.confirm?.message}>
          <TextInput
            id="reset-confirm"
            type="password"
            autoComplete="new-password"
            {...register('confirm')}
          />
        </FormField>
        {error ? (
          <p className="text-sm text-danger" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-sm bg-gold px-4 py-2.5 text-sm font-medium text-ink hover:bg-gold-deep disabled:opacity-60"
        >
          {isSubmitting ? 'Saving…' : 'Save password'}
        </button>
      </form>
    </StaffAuthShell>
  );
}
