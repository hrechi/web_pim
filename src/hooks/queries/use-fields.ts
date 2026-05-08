import { useQuery } from '@tanstack/react-query';
import { fieldsService } from '@/services/fields.service';

export function useFieldsQuery() {
  return useQuery({
    queryKey: ['fields', 'list'],
    queryFn: () => fieldsService.list(),
  });
}
