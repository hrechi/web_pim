import { apiDelete, apiGet, apiPost } from '@/lib/api/client';

export interface Staff {
  id: string;
  name: string;
  imagePath: string;
  createdAt?: string;
  updatedAt?: string;
}

export const staffService = {
  list: async () => {
    const res = await apiGet<Staff[] | { data: Staff[] }>('/staff');
    return Array.isArray(res) ? res : (res?.data ?? []);
  },
  get: (id: string) => apiGet<Staff>(`/staff/${id}`),
  remove: (id: string) => apiDelete<void>(`/staff/${id}`),
};
