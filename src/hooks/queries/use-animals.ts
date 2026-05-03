import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { animalsService, type Animal } from '@/services/animals.service';

export const animalsKeys = {
  all: ['animals'] as const,
  list: () => [...animalsKeys.all, 'list'] as const,
  detail: (id: string) => [...animalsKeys.all, 'detail', id] as const,
};

export function useAnimalsQuery() {
  return useQuery({ queryKey: animalsKeys.list(), queryFn: () => animalsService.list() });
}

export function useAnimalQuery(id?: string) {
  return useQuery({
    queryKey: id ? animalsKeys.detail(id) : animalsKeys.detail('-'),
    queryFn: () => animalsService.get(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateAnimalMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Animal>) => animalsService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: animalsKeys.list() }),
  });
}
