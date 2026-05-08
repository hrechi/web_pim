import { useQuery } from '@tanstack/react-query';
import { soilService } from '@/services/soil.service';

export function useSoilSamplesQuery(fieldId?: string) {
  return useQuery({
    queryKey: ['soil', 'list', fieldId ?? 'all'],
    queryFn: () => soilService.list(fieldId),
  });
}
