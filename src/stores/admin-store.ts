import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AdminState {
  adminToken: string | null;
  isAdminAuthenticated: boolean;
  setAdminToken: (token: string) => void;
  clearAdminToken: () => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      adminToken: null,
      isAdminAuthenticated: false,
      setAdminToken: (token) => set({ adminToken: token, isAdminAuthenticated: true }),
      clearAdminToken: () => set({ adminToken: null, isAdminAuthenticated: false }),
    }),
    {
      name: 'fieldly:admin',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        adminToken: s.adminToken,
        isAdminAuthenticated: s.isAdminAuthenticated,
      }),
    },
  ),
);

export const selectIsAdminAuthenticated = (state: AdminState) => state.isAdminAuthenticated;
