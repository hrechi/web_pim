import { apiGet } from '@/lib/api/client';

export interface Asset {
  id: string;
  name: string;
  brand: string;
  model?: string | null;
  modelYear?: number | null;
  mileage?: number | null;
  operatingHours?: number | null;
  category: string;
  status: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE';
  imageUrl?: string | null;
  serialNumber: string;
  lastServiceDate?: string | null;
  fieldId: string;
  field?: { id: string; name: string } | null;
  assignedTo?: { id: string; name: string; imagePath?: string | null } | null;
  createdAt: string;
  updatedAt: string;
}

export const assetsService = {
  list: (fieldId?: string) => {
    const url = fieldId ? `/assets?fieldId=${fieldId}` : '/assets';
    return apiGet<Asset[]>(url);
  },
  get: (id: string) => apiGet<Asset>(`/assets/${id}`),
};
