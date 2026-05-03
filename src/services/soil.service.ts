import { apiDelete, apiGet, apiPost } from '@/lib/api/client';

export interface SoilSample {
  id: string;
  parcelId?: string | null;
  fieldId?: string | null;
  ph?: number | null;
  soilMoisture?: number | null;
  sunlight?: number | null;
  temperature?: number | null;
  nutrients?: Record<string, number> | null;
  latitude?: number | null;
  longitude?: number | null;
  imagePath?: string | null;
  soilType?: string | null;
  detectionConfidence?: number | null;
  createdAt?: string;
  [key: string]: unknown;
}

export const soilService = {
  list: async () => {
    const res = await apiGet<SoilSample[] | { data: SoilSample[] }>('/soil');
    return Array.isArray(res) ? res : (res?.data ?? []);
  },
  get: async (id: string) => {
    const res = await apiGet<SoilSample | { data: SoilSample }>(`/soil/${id}`);
    return (res as { data?: SoilSample })?.data ?? (res as SoilSample);
  },
  create: (payload: Partial<SoilSample>) => apiPost<SoilSample>('/soil', payload),
  predict: (id: string) => apiGet<unknown>(`/soil/${id}/predict`),
  cropCompatibility: (payload: unknown) => apiPost<unknown>('/soil/crop-compatibility', payload),
  remove: (id: string) => apiDelete<void>(`/soil/${id}`),
};
