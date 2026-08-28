import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from './useAuth';

import { RouteFallback } from '@/components/layout/RouteFallback';

function Denied({ message }: { message: string }) {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="text-2xl">Access restricted</h1>
      <p className="mt-3 text-muted">{message}</p>
    </div>
  );
}

/** Gate for `/staff/**`. RLS is the real boundary; this is UX. */
export function RequireStaff({ children }: { children: ReactNode }) {
  const { isLoading, session, isStaff } = useAuth();
  const location = useLocation();

  if (isLoading) return <RouteFallback />;
  if (!session) {
    return <Navigate to="/staff/login" replace state={{ from: location.pathname }} />;
  }
  if (!isStaff) {
    return <Denied message="This account is not a K Pearl staff account." />;
  }
  return <>{children}</>;
}

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { isLoading, isAdmin } = useAuth();
  if (isLoading) return <RouteFallback />;
  if (!isAdmin) return <Denied message="This area is for administrators only." />;
  return <>{children}</>;
}
