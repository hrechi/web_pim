import { apiGet, apiDelete } from '@/lib/api/client';

export interface CatalogueAnimal {
  id: string;
  animalId: string;
  sortOrder: number;
  priceOverride?: number | null;
  notes?: string | null;
  animal: {
    id: string;
    name: string;
    animalType: string;
    breed?: string | null;
    sex: string;
    age: number;
    weight?: number | null;
    tagNumber?: string | null;
    profileImage?: string | null;
  };
}

export interface Catalogue {
  id: string;
  title: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';
  saleDate?: string | null;
  location?: string | null;
  currency: string;
  showPrices: boolean;
  shareToken?: string | null;
  shareViewCount: number;
  animals: CatalogueAnimal[];
  createdAt: string;
  updatedAt: string;
}

export interface CatalogueListResponse {
  items: Catalogue[];
  total: number;
  page: number;
  limit: number;
}

export const cataloguesService = {
  list: (page = 1, limit = 50) =>
    apiGet<CatalogueListResponse>(`/catalogues?page=${page}&limit=${limit}`),
  get: (id: string) => apiGet<Catalogue>(`/catalogues/${id}`),
  delete: (id: string) => apiDelete<{ message: string }>(`/catalogues/${id}`),
};
