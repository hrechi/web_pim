import { apiDelete, apiGet, apiPatch, apiPost } from '@/lib/api/client';

export interface Animal {
  id: string;
  name: string;
  animalType?: string;
  breed?: string | null;
  sex?: string;
  tagNumber?: string | null;
  profileImage?: string | null;
  status?: string;
  age?: number;
  ageYears?: number;
  birthWeightKg?: number | null;
  fieldId?: string;
  notes?: string | null;
  [key: string]: unknown;
}

export const animalsService = {
  list: async () => {
    const res = await apiGet<Animal[] | { data: Animal[] }>('/animals');
    return Array.isArray(res) ? res : (res?.data ?? []);
  },
  get: (id: string) => apiGet<Animal>(`/animals/id/${id}`),
  create: (payload: Partial<Animal>) => apiPost<Animal>('/animals', payload),
  update: (id: string, payload: Partial<Animal>) => apiPatch<Animal>(`/animals/${id}`, payload),
  remove: (id: string) => apiDelete<void>(`/animals/${id}`),
};
