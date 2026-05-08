import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Sprout } from 'lucide-react';
import { PageHeader } from '@/components/common/page-header';
import { LoadingState } from '@/components/common/loading-state';
import { ErrorState } from '@/components/common/error-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useParcelQuery } from '@/hooks/queries/use-parcels';
import { formatNumber } from '@/lib/utils';

export function ParcelDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: parcel, isLoading, isError, refetch } = useParcelQuery(id);

  if (isLoading) return <LoadingState />;
  if (isError || !parcel) return <ErrorState onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/app/parcels">
          <ArrowLeft className="size-4" /> Back to parcels
        </Link>
      </Button>
      <PageHeader
        icon={<Sprout className="size-5" />}
        title={parcel.location}
        description={`${parcel.soilType ?? 'Unknown soil'} · ${parcel.irrigationMethod ?? 'Manual irrigation'}`}
        actions={
          parcel.areaSize ? (
            <Badge variant="default" className="text-sm">
              {formatNumber(parcel.areaSize, 1)} ha
            </Badge>
          ) : undefined
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Crops</CardTitle>
          </CardHeader>
          <CardContent>
            {parcel.crops?.length ? (
              <ul className="divide-y divide-border/60">
                {parcel.crops.map((c) => (
                  <li key={c.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-ink">{c.cropName ?? 'Crop'}</p>
                      <p className="text-xs text-muted-foreground">
                        {c.variety ?? 'No variety'}
                        {c.plantingDate ? ` · planted ${new Date(c.plantingDate).toLocaleDateString()}` : ''}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No crops registered yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Soil snapshot</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 text-sm">
            <Stat label="pH" value={parcel.soilPh} />
            <Stat label="N" value={parcel.nitrogenLevel} />
            <Stat label="P" value={parcel.phosphorusLevel} />
            <Stat label="K" value={parcel.potassiumLevel} />
            <Stat label="Water" value={parcel.waterSource ?? '—'} />
            <Stat label="Frequency" value={parcel.irrigationFrequency ?? '—'} />
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string | null | undefined }) {
  return (
    <div className="rounded-xl border border-border/60 bg-bg/40 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold text-ink">{value ?? '—'}</p>
    </div>
  );
}
