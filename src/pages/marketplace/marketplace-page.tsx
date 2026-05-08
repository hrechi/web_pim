import { Store, Tag } from 'lucide-react';
import { PageHeader } from '@/components/common/page-header';
import { LoadingState } from '@/components/common/loading-state';
import { ErrorState } from '@/components/common/error-state';
import { EmptyState } from '@/components/common/empty-state';
import { Badge } from '@/components/ui/badge';
import { useForSaleAnimalsQuery } from '@/hooks/queries/use-marketplace';
import { useFieldStore } from '@/stores/field-store';
import { mediaUrl } from '@/lib/env';

const TYPE_EMOJI: Record<string, string> = {
  cow: '🐄',
  horse: '🐴',
  sheep: '🐑',
  dog: '🐕',
};

export function MarketplacePage() {
  const fieldId = useFieldStore((s) => s.selectedFieldId) ?? undefined;
  const { data, isLoading, isError, refetch } = useForSaleAnimalsQuery(fieldId);
  const animals = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Store className="size-5" />}
        title="Marketplace"
        description="Animals currently listed for sale on your farm."
      />

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : animals.length === 0 ? (
        <EmptyState
          icon={<Store className="size-6" />}
          title="No animals for sale"
          description="Mark animals as for sale from the mobile app to list them here."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {animals.map((a) => {
            const img = a.profileImage ? mediaUrl(a.profileImage as string) : undefined;
            const type = (a.animalType as string) ?? 'other';
            const salePrice = a.salePrice as number | null | undefined;
            const estimatedValue = a.estimatedValue as number | null | undefined;
            const price = salePrice ?? estimatedValue;

            return (
              <div
                key={a.id}
                className="rounded-2xl border border-border/60 bg-surface shadow-soft hover:shadow-card transition-all overflow-hidden"
              >
                {/* Image */}
                {img ? (
                  <div className="h-44 w-full overflow-hidden bg-muted/30">
                    <img src={img} alt={a.name} className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <div className="flex h-44 w-full items-center justify-center bg-primary/5 text-5xl">
                    {TYPE_EMOJI[type] ?? '🐾'}
                  </div>
                )}

                <div className="p-4 space-y-3">
                  {/* Name + type */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-ink">{a.name}</h3>
                      <p className="text-xs text-muted-foreground capitalize">
                        {[type, a.breed].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                    <Badge variant="secondary" className="capitalize shrink-0">{type}</Badge>
                  </div>

                  {/* Details */}
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {a.sex && <span className="capitalize">{a.sex as string}</span>}
                    {a.age != null && <span>{a.age as number} months</span>}
                    {(a.weight as number | null) && <span>{a.weight as number} kg</span>}
                    {a.tagNumber && <span>Tag: {a.tagNumber as string}</span>}
                  </div>

                  {/* Price */}
                  {price != null && (
                    <div className="flex items-center gap-1.5 rounded-xl bg-primary/10 px-3 py-2">
                      <Tag className="size-3.5 text-primary" />
                      <span className="font-bold text-primary">
                        {Number(price).toLocaleString()} TND
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
