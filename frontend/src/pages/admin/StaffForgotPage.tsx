import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { StaffAuthShell } from './StaffAuthShell';

import { FormField, TextInput } from '@/components/ui';
import { authRepository } from '@/repositories';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/schemas';

export default function StaffForgotPage() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await authRepository.sendPasswordReset(values.email);
    } finally {
      setSent(true); // don't reveal whether the address exists
    }
  });

  return (
    <StaffAuthShell title="Reset your password">
      {sent ? (
        <p className="text-sm text-charcoal">
          If that address belongs to a K Pearl staff account, a reset link is on its way. Check your
          inbox.
        </p>
      ) : (
        <form onSubmit={(e) => void onSubmit(e)} className="space-y-4" noValidate>
          <FormField label="Email" htmlFor="forgot-email" error={errors.email?.message}>
            <TextInput
              id="forgot-email"
              type="email"
              autoComplete="username"
              {...register('email')}
            />
          </FormField>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-sm bg-gold px-4 py-2.5 text-sm font-medium text-ink hover:bg-gold-deep disabled:opacity-60"
          >
            {isSubmitting ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
      )}
      <p className="mt-4 text-center text-sm">
        <Link to="/staff/login" className="text-gold-deep underline underline-offset-4">
          Back to sign in
        </Link>
      </p>
    </StaffAuthShell>
  );
}
