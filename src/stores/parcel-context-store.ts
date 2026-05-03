import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ParcelContextState {
  selectedParcelId: string | null;
  setSelectedParcel: (id: string | null) => void;
}

export const useParcelContext = create<ParcelContextState>()(
  persist(
    (set) => ({
      selectedParcelId: null,
      setSelectedParcel: (id) => set({ selectedParcelId: id }),
    }),
    {
      name: 'fieldly:parcel-context',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
