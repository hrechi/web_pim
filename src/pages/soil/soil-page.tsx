import { Mountain } from 'lucide-react';
import { PageHeader } from '@/components/common/page-header';
import { LoadingState } from '@/components/common/loading-state';
import { ErrorState } from '@/components/common/error-state';
import { EmptyState } from '@/components/common/empty-state';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSoilSamplesQuery } from '@/hooks/queries/use-soil';
import { useFieldStore } from '@/stores/field-store';

export function SoilPage() {
  const fieldId = useFieldStore((s) => s.selectedFieldId) ?? undefined;
  const fieldName = useFieldStore((s) => s.selectedField?.name);
  const { data, isLoading, isError, refetch } = useSoilSamplesQuery(fieldId);
  const samples = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Mountain className="size-5" />}
        title="Soil analysis"
        description="Recent soil samples and AI-predicted soil types."
      />
      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : samples.length === 0 ? (
        <EmptyState
          icon={<Mountain className="size-6" />}
          title="No soil samples yet"
          description="Submit a soil sample from the mobile app to start tracking soil health."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {samples.map((s) => {
            const n = typeof s.nutrients?.N === 'number' ? s.nutrients.N : s.nutrients?.nitrogen;
            const p = typeof s.nutrients?.P === 'number' ? s.nutrients.P : s.nutrients?.phosphorus;
            const k = typeof s.nutrients?.K === 'number' ? s.nutrients.K : s.nutrients?.potassium;
            return (
              <Card key={s.id}>
                <CardContent className="space-y-3 p-5">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{s.soilType ?? fieldName ?? 'Sample'}</Badge>
                    {s.createdAt ? (
                      <span className="text-xs text-muted-foreground">
                        {new Date(s.createdAt).toLocaleDateString()}
                      </span>
                    ) : null}
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <Metric label="pH" value={s.ph} />
                    <Metric label="N" value={n} />
                    <Metric label="P" value={p} />
                    <Metric label="K" value={k} />
                    <Metric label="Moist." value={s.soilMoisture} unit="%" />
                    <Metric label="Temp" value={s.temperature} unit="°" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Metric({
  label,
  value,
  unit,
}: {
  label: string;
  value?: number | null;
  unit?: string;
}) {
  return (
    <div className="rounded-xl bg-bg/60 p-2">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-ink">
        {value == null ? '—' : `${value}${unit ?? ''}`}
      </p>
    </div>
  );
}
