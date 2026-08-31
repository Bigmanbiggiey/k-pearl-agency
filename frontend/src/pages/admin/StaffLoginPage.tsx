import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';

import { StaffAuthShell } from './StaffAuthShell';

import { FormField, TextInput } from '@/components/ui';
import { useAuth } from '@/features/auth';
import { authRepository } from '@/repositories';
import { staffLoginSchema, type StaffLoginInput } from '@/schemas';

export default function StaffLoginPage() {
  const { session, isStaff, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/staff';
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StaffLoginInput>({
    resolver: zodResolver(staffLoginSchema),
    defaultValues: { email: '', password: '' },
  });

  if (!isLoading && session && isStaff) {
    return <Navigate to={from} replace />;
  }

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    try {
      await authRepository.signInWithPassword(values.email, values.password);
      void navigate(from, { replace: true });
    } catch {
      setError('Those details did not match. Please try again.');
    }
  });

  return (
    <StaffAuthShell title="Staff sign in">
      <form onSubmit={(e) => void onSubmit(e)} className="space-y-4" noValidate>
        <FormField label="Email" htmlFor="login-email" error={errors.email?.message}>
          <TextInput id="login-email" type="email" autoComplete="username" {...register('email')} />
        </FormField>
        <FormField label="Password" htmlFor="login-password" error={errors.password?.message}>
          <TextInput
            id="login-password"
            type="password"
            autoComplete="current-password"
            {...register('password')}
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
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
        <p className="text-center text-sm">
          <Link to="/staff/forgot" className="text-gold-deep underline underline-offset-4">
            Forgot your password?
          </Link>
        </p>
      </form>
    </StaffAuthShell>
  );
}
