import { apiDelete, apiGet, apiPatch, apiPost } from '@/lib/api/client';
import type { Parcel } from '@/types/parcel';

type Envelope<T> = { data: T };

export const parcelsService = {
  list: async (fieldId?: string) => {
    const res = await apiGet<Parcel[] | Envelope<Parcel[]>>('/parcels');
    const all = Array.isArray(res) ? res : (res?.data ?? []);
    // Parcels don't have fieldId on backend — filter client-side by field name if needed
    return all;
  },
  get: async (id: string) => {
    const res = await apiGet<Parcel | Envelope<Parcel>>(`/parcels/${id}`);
    return (res as Envelope<Parcel>)?.data ?? (res as Parcel);
  },
  create: (payload: Partial<Parcel>) => apiPost<Parcel>('/parcels', payload),
  update: (id: string, payload: Partial<Parcel>) => apiPatch<Parcel>(`/parcels/${id}`, payload),
  remove: (id: string) => apiDelete<void>(`/parcels/${id}`),
  recommendCrops: (id: string) => apiGet<unknown>(`/parcels/${id}/recommend-crops`),
};
