import { useQuery } from '@tanstack/react-query';
import { soilService } from '@/services/soil.service';

export function useSoilSamplesQuery() {
  return useQuery({ queryKey: ['soil', 'list'], queryFn: () => soilService.list() });
}
