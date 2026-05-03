import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { parcelsService } from '@/services/parcels.service';
import type { Parcel } from '@/types/parcel';

export const parcelsKeys = {
  all: ['parcels'] as const,
  list: () => [...parcelsKeys.all, 'list'] as const,
  detail: (id: string) => [...parcelsKeys.all, 'detail', id] as const,
};

export function useParcelsQuery() {
  return useQuery({ queryKey: parcelsKeys.list(), queryFn: () => parcelsService.list() });
}

export function useParcelQuery(id: string | undefined) {
  return useQuery({
    queryKey: id ? parcelsKeys.detail(id) : parcelsKeys.detail('-'),
    queryFn: () => parcelsService.get(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateParcelMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Parcel>) => parcelsService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: parcelsKeys.list() }),
  });
}

export function useDeleteParcelMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => parcelsService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: parcelsKeys.list() }),
  });
}
