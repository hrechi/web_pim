import { useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, Scale } from 'lucide-react';
import { PageHeader } from '@/components/common/page-header';
import { LoadingState } from '@/components/common/loading-state';
import { ErrorState } from '@/components/common/error-state';
import { EmptyState } from '@/components/common/empty-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFieldStore } from '@/stores/field-store';
import { useFinanceDashboardQuery } from '@/hooks/queries/use-finance';

type Period = 'month' | 'quarter' | 'year';

const PERIODS: { value: Period; label: string }[] = [
  { value: 'month', label: 'This month' },
  { value: 'quarter', label: 'This quarter' },
  { value: 'year', label: 'This year' },
];

export function FinancePage() {
  const [period, setPeriod] = useState<Period>('month');
  const activeFieldId = useFieldStore((s) => s.selectedFieldId) ?? undefined;
  const { data, isLoading, isError, refetch } = useFinanceDashboardQuery(activeFieldId, period);
  const sym = data?.currencySymbol ?? '$';

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Wallet className="size-5" />}
        title="Finance"
        description="Revenue, expenses and net balance for your farm."
        actions={
          <div className="flex gap-1 rounded-xl border border-border/60 bg-surface p-1">
            {PERIODS.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  period === p.value
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-muted-foreground hover:text-ink'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        }
      />

      {!activeFieldId ? (
        <EmptyState
          icon={<Wallet className="size-6" />}
          title="No field selected"
          description="Select a field from the switcher in the top bar to view finances."
        />
      ) : isLoading ? (
        <LoadingState />
      ) : isError || !data ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <div className="space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <SummaryCard
              icon={<TrendingUp className="size-5 text-primary" />}
              label="Revenue"
              value={`${sym}${data.totalRevenue.toLocaleString()}`}
              bg="bg-primary/10"
            />
            <SummaryCard
              icon={<TrendingDown className="size-5 text-danger" />}
              label="Expenses"
              value={`${sym}${data.totalExpenses.toLocaleString()}`}
              bg="bg-danger/10"
            />
            <SummaryCard
              icon={<Scale className="size-5 text-warning" />}
              label="Net balance"
              value={`${sym}${data.netBalance.toLocaleString()}`}
              bg={data.netBalance >= 0 ? 'bg-primary/10' : 'bg-danger/10'}
              valueClass={data.netBalance >= 0 ? 'text-primary' : 'text-danger'}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Expenses by category */}
            <Card>
              <CardHeader><CardTitle>Expenses by category</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {Object.keys(data.expensesByCategory).length === 0 ? (
                  <p className="text-sm text-muted-foreground">No expenses recorded.</p>
                ) : (
                  Object.entries(data.expensesByCategory).map(([cat, val]) => (
                    <div key={cat}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-medium text-ink capitalize">{cat}</span>
                        <span className="text-muted-foreground">
                          {sym}{val.amount.toLocaleString()} · {val.percentage.toFixed(0)}%
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted/40">
                        <div
                          className="h-full rounded-full bg-primary/70"
                          style={{ width: `${Math.min(val.percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Recent expenses */}
            <Card>
              <CardHeader><CardTitle>Recent expenses</CardTitle></CardHeader>
              <CardContent>
                {data.recentExpenses.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No recent expenses.</p>
                ) : (
                  <ul className="divide-y divide-border/60">
                    {data.recentExpenses.map((e) => (
                      <li key={e.id} className="flex items-center justify-between py-3">
                        <div>
                          <p className="text-sm font-medium text-ink capitalize">{e.category}</p>
                          {e.animalName && <p className="text-xs text-muted-foreground">{e.animalName}</p>}
                          <p className="text-xs text-muted-foreground">{new Date(e.date).toLocaleDateString()}</p>
                        </div>
                        <span className="font-semibold text-danger">-{sym}{e.amount.toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Top costly animals */}
          {data.topCostlyAnimals.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Top costly animals</CardTitle></CardHeader>
              <CardContent>
                <ul className="divide-y divide-border/60">
                  {data.topCostlyAnimals.map((a, idx) => (
                    <li key={a.animalId} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex size-7 items-center justify-center rounded-full bg-muted/60 text-xs font-bold text-muted-foreground">{idx + 1}</span>
                        <span className="font-medium text-ink">{a.name}</span>
                      </div>
                      <span className="font-semibold text-danger">{sym}{a.totalCost.toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

function SummaryCard({ icon, label, value, bg, valueClass = 'text-ink' }: {
  icon: React.ReactNode; label: string; value: string; bg: string; valueClass?: string;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-surface p-5 shadow-soft">
      <div className="flex items-center gap-3">
        <div className={`flex size-10 items-center justify-center rounded-xl ${bg}`}>{icon}</div>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
      <p className={`mt-3 font-display text-2xl font-bold ${valueClass}`}>{value}</p>
    </div>
  );
}
