import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

import { AuthContext, type AuthState } from './AuthContext';

import { authRepository, profileRepository, type Profile, type Session } from '@/repositories';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const loadProfile = useCallback(async (userId: string | undefined) => {
    if (!userId) {
      setProfile(null);
      return;
    }
    try {
      setProfile(await profileRepository.getById(userId));
    } catch {
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    let active = true;

    void authRepository.getSession().then(async (initial) => {
      if (!active) return;
      setSession(initial);
      await loadProfile(initial?.user.id);
      if (active) setIsLoading(false);
    });

    const unsubscribe = authRepository.onAuthStateChange((next) => {
      setSession(next);
      void loadProfile(next?.user.id);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [loadProfile]);

  const value = useMemo<AuthState>(
    () => ({
      isLoading,
      session,
      user: session?.user ?? null,
      profile,
      isStaff: profile !== null,
      isAdmin: profile?.role === 'admin',
      signOut: () => authRepository.signOut(),
      refreshProfile: () => loadProfile(session?.user.id),
    }),
    [isLoading, session, profile, loadProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
