import { useQuery } from '@tanstack/react-query';
import { assetsService } from '@/services/assets.service';

export function useAssetsQuery(fieldId?: string) {
  return useQuery({
    queryKey: ['assets', 'list', fieldId ?? 'all'],
    queryFn: () => assetsService.list(fieldId),
  });
}
