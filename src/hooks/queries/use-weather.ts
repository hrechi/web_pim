import { useQuery } from '@tanstack/react-query';
import { weatherService } from '@/services/weather.service';

export function useWeatherQuery(fieldId?: string) {
  return useQuery({
    queryKey: ['weather', fieldId],
    queryFn: () => weatherService.forField(fieldId as string),
    enabled: Boolean(fieldId),
  });
}
