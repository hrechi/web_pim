export interface ParcelCrop {
  id: string;
  cropName?: string;
  variety?: string;
  plantingDate?: string;
  expectedHarvestDate?: string;
  [key: string]: unknown;
}

export interface Parcel {
  id: string;
  /** Human label (Prisma stores it as `location`). */
  location: string;
  areaSize: number;
  polygon?: unknown;
  boundariesDescription?: string;
  soilType?: string | null;
  soilPh?: number | null;
  nitrogenLevel?: number | null;
  phosphorusLevel?: number | null;
  potassiumLevel?: number | null;
  waterSource?: string | null;
  irrigationMethod?: string | null;
  irrigationFrequency?: string | null;
  farmerId?: string;
  crops?: ParcelCrop[];
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}
