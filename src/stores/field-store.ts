import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Field } from '@/services/fields.service';

interface FieldState {
  selectedFieldId: string | null;
  selectedField: Field | null;
  setField: (field: Field) => void;
  clearField: () => void;
}

export const useFieldStore = create<FieldState>()(
  persist(
    (set) => ({
      selectedFieldId: null,
      selectedField: null,
      setField: (field) => set({ selectedFieldId: field.id, selectedField: field }),
      clearField: () => set({ selectedFieldId: null, selectedField: null }),
    }),
    {
      name: 'fieldly:selected-field',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
