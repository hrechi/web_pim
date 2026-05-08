import { apiDelete, apiGet, apiPost } from '@/lib/api/client';

export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | string;
export type IncidentStatus = 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED' | string;

export interface Incident {
  id: string;
  title?: string;
  description?: string;
  severity?: IncidentSeverity;
  status?: IncidentStatus;
  detectedAt?: string;
  timestamp?: string;
  type?: string;
  imagePath?: string | null;
  imageUrl?: string | null;
  videoUrl?: string | null;
  audioUrl?: string | null;
  parcelId?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
}

export const incidentsService = {
  list: async () => {
    const res = await apiGet<Incident[] | { data: Incident[] }>('/security/incidents');
    return Array.isArray(res) ? res : (res?.data ?? []);
  },
  get: (id: string) => apiGet<Incident>(`/security/incidents/${id}`),
  create: (payload: Partial<Incident>) => apiPost<Incident>('/security/incidents', payload),
  remove: (id: string) => apiDelete<void>(`/security/incidents/${id}`),
};
