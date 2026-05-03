import { useQuery } from '@tanstack/react-query';
import { incidentsService } from '@/services/incidents.service';

export function useIncidentsQuery() {
  return useQuery({
    queryKey: ['incidents', 'list'],
    queryFn: () => incidentsService.list(),
  });
}

export function useIncidentQuery(id?: string) {
  return useQuery({
    queryKey: ['incidents', 'detail', id],
    queryFn: () => incidentsService.get(id as string),
    enabled: Boolean(id),
  });
}
