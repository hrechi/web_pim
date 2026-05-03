import { apiGet, apiPost } from '@/lib/api/client';

export interface WeatherForecast {
  location?: { lat: number; lng: number; name?: string };
  current?: Record<string, unknown>;
  daily?: Array<Record<string, unknown>>;
  hourly?: Array<Record<string, unknown>>;
  [key: string]: unknown;
}

export const weatherService = {
  forField: (fieldId: string) => apiGet<WeatherForecast>(`/weather/${fieldId}`),
  recommendations: (fieldId: string) =>
    apiPost<unknown>(`/weather/${fieldId}/recommendations`),
};
