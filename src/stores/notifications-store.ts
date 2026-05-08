import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface NotificationsState {
  lastSeenAt: string | null;
  clearedIds: string[];         // incident IDs the user has cleared
  markSeen: () => void;
  clearAll: (ids: string[]) => void;
  isClearedId: (id: string) => boolean;
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      lastSeenAt: null,
      clearedIds: [],
      markSeen: () => set({ lastSeenAt: new Date().toISOString() }),
      clearAll: (ids: string[]) =>
        set((s) => ({ clearedIds: [...new Set([...s.clearedIds, ...ids])] })),
      isClearedId: (id: string) => get().clearedIds.includes(id),
    }),
    {
      name: 'fieldly:notifications',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
