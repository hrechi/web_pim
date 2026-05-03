import { Link } from 'react-router-dom';
import { Plus, Sprout } from 'lucide-react';
import { PageHeader } from '@/components/common/page-header';
import { LoadingState } from '@/components/common/loading-state';
import { ErrorState } from '@/components/common/error-state';
import { EmptyState } from '@/components/common/empty-state';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useParcelsQuery } from '@/hooks/queries/use-parcels';
import { formatNumber } from '@/lib/utils';

export function ParcelsListPage() {
  const { data, isLoading, isError, refetch } = useParcelsQuery();
  const parcels = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Sprout className="size-5" />}
        title="Parcels"
        description="Browse and manage every plot of land on your farm."
        actions={
          <Button variant="gradient" disabled>
            <Plus className="size-4" /> New parcel
          </Button>
        }
      />

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : parcels.length === 0 ? (
        <EmptyState
          icon={<Sprout className="size-6" />}
          title="No parcels yet"
          description="Create your first parcel from the mobile app to see it appear here."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {parcels.map((parcel) => (
            <Link key={parcel.id} to={`/app/parcels/${parcel.id}`}>
              <Card className="group overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-card">
                <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-gradient-brand text-white/80">
                  <Sprout className="size-12" />
                  {parcel.areaSize ? (
                    <Badge
                      variant="default"
                      className="absolute right-3 top-3 bg-white/90 text-primary backdrop-blur"
                    >
                      {formatNumber(parcel.areaSize, 1)} ha
                    </Badge>
                  ) : null}
                </div>
                <CardContent className="p-5">
                  <h3 className="text-lg font-semibold text-ink">{parcel.location}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {parcel.soilType ?? 'Soil type unknown'} ·{' '}
                    {parcel.irrigationMethod ?? 'Manual irrigation'}
                  </p>
                  {parcel.crops?.length ? (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {parcel.crops.slice(0, 3).map((c) => (
                        <Badge key={c.id} variant="secondary">
                          {c.cropName ?? 'Crop'}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
