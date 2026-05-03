import { useMemo } from 'react';
import { CloudSun } from 'lucide-react';
import { PageHeader } from '@/components/common/page-header';
import { LoadingState } from '@/components/common/loading-state';
import { ErrorState } from '@/components/common/error-state';
import { EmptyState } from '@/components/common/empty-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useParcelsQuery } from '@/hooks/queries/use-parcels';
import { useWeatherQuery } from '@/hooks/queries/use-weather';
import { useParcelContext } from '@/stores/parcel-context-store';

export function WeatherPage() {
  const parcels = useParcelsQuery();
  const selectedParcelId = useParcelContext((s) => s.selectedParcelId);
  const setSelectedParcelId = useParcelContext((s) => s.setSelectedParcel);

  const parcelList = Array.isArray(parcels.data) ? parcels.data : [];

  const fieldId = useMemo(() => {
    if (selectedParcelId && parcelList.some((p) => p.id === selectedParcelId)) {
      return selectedParcelId;
    }
    return parcelList[0]?.id;
  }, [selectedParcelId, parcelList]);

  const weather = useWeatherQuery(fieldId);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<CloudSun className="size-5" />}
        title="Weather"
        description="7-day forecast and AI farming recommendations per parcel."
        actions={
          parcelList.length > 0 ? (
            <select
              className="h-10 rounded-xl border border-input bg-surface px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              value={fieldId ?? ''}
              onChange={(e) => setSelectedParcelId(e.target.value || null)}
            >
              {parcelList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.location}
                </option>
              ))}
            </select>
          ) : undefined
        }
      />

      {parcels.isLoading ? (
        <LoadingState />
      ) : parcelList.length === 0 ? (
        <EmptyState
          icon={<CloudSun className="size-6" />}
          title="No parcels to forecast"
          description="Add a parcel first to see localized weather data."
        />
      ) : weather.isLoading ? (
        <LoadingState label="Fetching weather…" />
      ) : weather.isError ? (
        <ErrorState onRetry={weather.refetch} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="max-h-[60vh] overflow-auto rounded-xl bg-bg/60 p-4 text-xs text-muted-foreground">
{JSON.stringify(weather.data, null, 2)}
            </pre>
            <p className="mt-3 text-xs text-muted-foreground">
              Rich charts and a styled forecast view will replace this raw payload in a follow-up.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
