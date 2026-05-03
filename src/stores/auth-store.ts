import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthTokens, AuthUser } from '@/types/auth';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  rememberMe: boolean;
  hydrated: boolean;
  setSession: (payload: { user: AuthUser } & AuthTokens) => void;
  setTokens: (tokens: AuthTokens) => void;
  setUser: (user: AuthUser | null) => void;
  setRememberMe: (value: boolean) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      rememberMe: false,
      hydrated: true,

      setSession: ({ user, accessToken, refreshToken }) => {
        set({ user, accessToken, refreshToken });
        // Store farmer account for admin tracking
        if (user.role === 'FARMER') {
          const accounts = JSON.parse(localStorage.getItem('farmerAccounts') || '[]');
          const exists = accounts.find((a: any) => a.id === user.id);
          if (!exists) {
            accounts.push(user);
            localStorage.setItem('farmerAccounts', JSON.stringify(accounts));
          }
        }
      },
      setTokens: ({ accessToken, refreshToken }) => set({ accessToken, refreshToken }),
      setUser: (user) => set({ user }),
      setRememberMe: (value) => set({ rememberMe: value }),
      clear: () => set({ accessToken: null, refreshToken: null, user: null }),
    }),
    {
      name: 'fieldly:auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        accessToken: s.accessToken,
        refreshToken: s.refreshToken,
        user: s.user,
        rememberMe: s.rememberMe,
      }),
      onRehydrateStorage: () => (state) => {
        // localStorage is synchronous; mark hydrated either way so guards run.
        if (state) {
          state.hydrated = true;
        } else {
          useAuthStore.setState({ hydrated: true });
        }
      },
    },
  ),
);

export function selectIsAuthenticated(s: AuthState): boolean {
  return Boolean(s.accessToken && s.user);
}
