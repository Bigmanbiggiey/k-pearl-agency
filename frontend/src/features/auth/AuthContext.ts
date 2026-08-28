import { createContext } from 'react';

import type { Profile, Session, User } from '@/repositories';

export interface AuthState {
  isLoading: boolean;
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isStaff: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthState | null>(null);
