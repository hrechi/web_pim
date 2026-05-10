import { Tractor, MapPin, Hash, Clock, Gauge } from 'lucide-react';
import { PageHeader } from '@/components/common/page-header';
import { LoadingState } from '@/components/common/loading-state';
import { ErrorState } from '@/components/common/error-state';
import { EmptyState } from '@/components/common/empty-state';
import { useAssetsQuery } from '@/hooks/queries/use-assets';
import { useFieldStore } from '@/stores/field-store';
import type { Asset } from '@/services/assets.service';

const STATUS_STYLES: Record<Asset['status'], { dot: string; label: string }> = {
  AVAILABLE: { dot: 'bg-primary', label: 'Available' },
  IN_USE: { dot: 'bg-warning', label: 'In Use' },
  MAINTENANCE: { dot: 'bg-danger', label: 'Maintenance' },
};

export function EquipmentPage() {
  const fieldId = useFieldStore((s) => s.selectedFieldId) ?? undefined;
  const { data, isLoading, isError, refetch } = useAssetsQuery(fieldId);
  const assets = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Tractor className="size-5" />}
        title="Equipment"
        description="Your farm assets and machinery."
      />

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : assets.length === 0 ? (
        <EmptyState
          icon={<Tractor className="size-6" />}
          title="No equipment yet"
          description="Add your farm equipment from the mobile app to track usage and maintenance."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {assets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      )}
    </div>
  );
}

function AssetCard({ asset }: { asset: Asset }) {
  const status = STATUS_STYLES[asset.status];

  return (
    <div className="rounded-2xl border border-border/60 bg-surface p-5 shadow-soft hover:shadow-card transition-all space-y-4">
      {/* Image or placeholder */}
      {asset.imageUrl ? (
        <div className="h-36 w-full overflow-hidden rounded-xl bg-muted/40">
          <img
            src={asset.imageUrl}
            alt={asset.name}
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="flex h-36 w-full items-center justify-center rounded-xl bg-muted/30">
          <Tractor className="size-10 text-muted-foreground/40" />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-semibold text-ink leading-tight truncate">{asset.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {asset.brand}{asset.model ? ` · ${asset.model}` : ''}{asset.modelYear ? ` (${asset.modelYear})` : ''}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span className={`size-2 rounded-full ${status.dot}`} />
          <span className="text-[11px] font-medium text-muted-foreground">{status.label}</span>
        </div>
      </div>

      {/* Category badge */}
      <span className="inline-block rounded-full bg-muted/60 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
        {asset.category}
      </span>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        {asset.mileage != null && (
          <Stat icon={Gauge} label="Mileage" value={`${asset.mileage.toLocaleString()} km`} />
        )}
        {asset.operatingHours != null && (
          <Stat icon={Clock} label="Hours" value={`${asset.operatingHours.toLocaleString()} h`} />
        )}
        {asset.serialNumber && (
          <Stat icon={Hash} label="Serial" value={asset.serialNumber} />
        )}
        {asset.field?.name && (
          <Stat icon={MapPin} label="Field" value={asset.field.name} />
        )}
      </div>

      {/* Assigned worker */}
      {asset.assignedTo && (
        <div className="border-t border-border/40 pt-3 text-xs text-muted-foreground">
          Assigned to <span className="font-medium text-ink">{asset.assignedTo.name}</span>
        </div>
      )}

      {/* Last service */}
      {asset.lastServiceDate && (
        <div className="text-[11px] text-muted-foreground">
          Last service: {new Date(asset.lastServiceDate).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-bg/60 p-2.5">
      <div className="flex items-center gap-1 mb-0.5">
        <Icon className="size-3 text-muted-foreground" />
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      </div>
      <p className="text-xs font-semibold text-ink truncate">{value}</p>
    </div>
  );
}
