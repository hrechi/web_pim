import { apiGet } from '@/lib/api/client';
import type { Animal } from '@/services/animals.service';

export const marketplaceService = {
  forSale: (fieldId?: string) => {
    const url = fieldId ? `/animals/for-sale?fieldId=${fieldId}` : '/animals/for-sale';
    return apiGet<Animal[]>(url);
  },
};
