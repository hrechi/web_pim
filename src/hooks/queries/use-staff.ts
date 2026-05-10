import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { staffService, type Staff } from '@/services/staff.service';

export const staffKeys = {
  all: ['staff'] as const,
  list: () => [...staffKeys.all, 'list'] as const,
  detail: (id: string) => [...staffKeys.all, 'detail', id] as const,
};

export function useStaffQuery(fieldId?: string) {
  return useQuery({
    queryKey: [...staffKeys.list(), fieldId ?? 'all'],
    queryFn: () => staffService.list(fieldId),
  });
}

export function useStaffDetailQuery(id?: string) {
  return useQuery({
    queryKey: id ? staffKeys.detail(id) : staffKeys.detail('-'),
    queryFn: () => staffService.get(id as string),
    enabled: Boolean(id),
  });
}

export function useDeleteStaffMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => staffService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: staffKeys.list() }),
  });
}

export function useRefreshStaff() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: staffKeys.list() });
}
