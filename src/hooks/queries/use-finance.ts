import { useQuery } from '@tanstack/react-query';
import { financeService } from '@/services/finance.service';

export function useFinanceDashboardQuery(
  fieldId: string | undefined,
  period: 'month' | 'quarter' | 'year' = 'month',
) {
  return useQuery({
    queryKey: ['finance', 'dashboard', fieldId, period],
    queryFn: () => financeService.dashboard(fieldId as string, period),
    enabled: Boolean(fieldId),
  });
}

export function useExpensesQuery(fieldId: string | undefined) {
  return useQuery({
    queryKey: ['expenses', fieldId],
    queryFn: () => financeService.expenses(fieldId as string),
    enabled: Boolean(fieldId),
  });
}
