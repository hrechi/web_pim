import { Package, Tractor, Clock, Gauge, Hash, MapPin } from 'lucide-react';
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

// Group assets by category
function groupByCategory(assets: Asset[]) {
  return assets.reduce<Record<string, Asset[]>>((acc, a) => {
    const cat = a.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(a);
    return acc;
  }, {});
}

export function InventoryPage() {
  const fieldId = useFieldStore((s) => s.selectedFieldId) ?? undefined;
  const { data, isLoading, isError, refetch } = useAssetsQuery(fieldId);
  const assets = Array.isArray(data) ? data : [];
  const groups = groupByCategory(assets);

  const available = assets.filter((a) => a.status === 'AVAILABLE').length;
  const inUse = assets.filter((a) => a.status === 'IN_USE').length;
  const maintenance = assets.filter((a) => a.status === 'MAINTENANCE').length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Package className="size-5" />}
        title="Inventory"
        description="All farm equipment and assets."
      />

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : assets.length === 0 ? (
        <EmptyState
          icon={<Package className="size-6" />}
          title="No inventory yet"
          description="Add equipment from the mobile app to track your farm assets."
        />
      ) : (
        <div className="space-y-6">
          {/* Summary row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-border/60 bg-surface p-4 text-center shadow-soft">
              <p className="font-display text-2xl font-bold text-primary">{available}</p>
              <p className="mt-1 text-xs text-muted-foreground">Available</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-surface p-4 text-center shadow-soft">
              <p className="font-display text-2xl font-bold text-warning">{inUse}</p>
              <p className="mt-1 text-xs text-muted-foreground">In Use</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-surface p-4 text-center shadow-soft">
              <p className="font-display text-2xl font-bold text-danger">{maintenance}</p>
              <p className="mt-1 text-xs text-muted-foreground">Maintenance</p>
            </div>
          </div>

          {/* Grouped by category */}
          {Object.entries(groups).map(([category, list]) => (
            <div key={category}>
              <h2 className="mb-3 font-display text-base font-bold text-ink">{category}</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((asset) => (
                  <AssetRow key={asset.id} asset={asset} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AssetRow({ asset }: { asset: Asset }) {
  const status = STATUS_STYLES[asset.status];
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border/60 bg-surface p-4 shadow-soft hover:shadow-card transition-all">
      {/* Icon or image */}
      {asset.imageUrl ? (
        <img src={asset.imageUrl} alt={asset.name} className="size-14 shrink-0 rounded-xl object-cover border border-border/40" />
      ) : (
        <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <Tractor className="size-6 text-primary" />
        </div>
      )}

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <p className="font-semibold text-ink truncate">{asset.name}</p>
          <div className="flex shrink-0 items-center gap-1">
            <span className={`size-2 rounded-full ${status.dot}`} />
            <span className="text-[11px] text-muted-foreground">{status.label}</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {asset.brand}{asset.model ? ` · ${asset.model}` : ''}
        </p>
        <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
          {asset.mileage != null && (
            <span className="flex items-center gap-0.5"><Gauge className="size-3" />{asset.mileage.toLocaleString()} km</span>
          )}
          {asset.operatingHours != null && (
            <span className="flex items-center gap-0.5"><Clock className="size-3" />{asset.operatingHours.toLocaleString()} h</span>
          )}
          {asset.serialNumber && (
            <span className="flex items-center gap-0.5"><Hash className="size-3" />{asset.serialNumber}</span>
          )}
          {asset.field?.name && (
            <span className="flex items-center gap-0.5"><MapPin className="size-3" />{asset.field.name}</span>
          )}
        </div>
      </div>
    </div>
  );
}
