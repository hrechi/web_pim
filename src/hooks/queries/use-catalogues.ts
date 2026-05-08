import { useQuery } from '@tanstack/react-query';
import { cataloguesService } from '@/services/catalogues.service';

export function useCataloguesQuery() {
  return useQuery({
    queryKey: ['catalogues', 'list'],
    queryFn: () => cataloguesService.list(),
  });
}
