import { apiGet } from '@/lib/api/client';

export interface Field {
  id: string;
  name: string;
  userId: string;
  areaSize?: number | null;
  cropType?: string | null;
  createdAt?: string;
}

export const fieldsService = {
  list: () => apiGet<Field[]>('/field'),
};
