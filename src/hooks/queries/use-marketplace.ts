import { useQuery } from '@tanstack/react-query';
import { marketplaceService } from '@/services/marketplace.service';

export function useForSaleAnimalsQuery(fieldId?: string) {
  return useQuery({
    queryKey: ['marketplace', 'for-sale', fieldId ?? 'all'],
    queryFn: () => marketplaceService.forSale(fieldId),
  });
}
