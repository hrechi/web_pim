import { ScrollText, MapPin, Calendar, Eye, Package } from 'lucide-react';
import { PageHeader } from '@/components/common/page-header';
import { LoadingState } from '@/components/common/loading-state';
import { ErrorState } from '@/components/common/error-state';
import { EmptyState } from '@/components/common/empty-state';
import { Badge } from '@/components/ui/badge';
import { useCataloguesQuery } from '@/hooks/queries/use-catalogues';
import type { Catalogue } from '@/services/catalogues.service';

const STATUS_STYLES: Record<Catalogue['status'], string> = {
  DRAFT: 'bg-muted/60 text-muted-foreground',
  PUBLISHED: 'bg-primary/15 text-primary',
  CLOSED: 'bg-warning/15 text-warning',
  ARCHIVED: 'bg-danger/10 text-danger',
};

export function CataloguesPage() {
  const { data, isLoading, isError, refetch } = useCataloguesQuery();
  const catalogues = data?.items ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<ScrollText className="size-5" />}
        title="Sale Catalogues"
        description="Your animal sale catalogues."
      />

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : catalogues.length === 0 ? (
        <EmptyState
          icon={<ScrollText className="size-6" />}
          title="No catalogues yet"
          description="Create a sale catalogue from the mobile app to list your animals for sale."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {catalogues.map((cat) => (
            <CatalogueCard key={cat.id} catalogue={cat} />
          ))}
        </div>
      )}
    </div>
  );
}

function CatalogueCard({ catalogue }: { catalogue: Catalogue }) {
  const animalCount = catalogue.animals?.length ?? 0;

  return (
    <div className="rounded-2xl border border-border/60 bg-surface p-5 shadow-soft hover:shadow-card transition-all space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-ink leading-tight line-clamp-2">{catalogue.title}</h3>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${STATUS_STYLES[catalogue.status]}`}
        >
          {catalogue.status}
        </span>
      </div>

      {/* Meta */}
      <div className="space-y-1.5 text-xs text-muted-foreground">
        {catalogue.location && (
          <div className="flex items-center gap-1.5">
            <MapPin className="size-3.5 shrink-0" />
            <span className="truncate">{catalogue.location}</span>
          </div>
        )}
        {catalogue.saleDate && (
          <div className="flex items-center gap-1.5">
            <Calendar className="size-3.5 shrink-0" />
            <span>{new Date(catalogue.saleDate).toLocaleDateString()}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <Package className="size-3.5 shrink-0" />
          <span>{animalCount} animal{animalCount !== 1 ? 's' : ''}</span>
        </div>
        {catalogue.shareToken && (
          <div className="flex items-center gap-1.5">
            <Eye className="size-3.5 shrink-0" />
            <span>{catalogue.shareViewCount} view{catalogue.shareViewCount !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {/* Animals preview */}
      {animalCount > 0 && (
        <div className="border-t border-border/40 pt-3">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Animals
          </p>
          <div className="flex flex-wrap gap-1.5">
            {catalogue.animals.slice(0, 5).map((ca) => (
              <Badge key={ca.id} variant="secondary" className="text-[11px]">
                {ca.animal.name}
              </Badge>
            ))}
            {animalCount > 5 && (
              <Badge variant="outline" className="text-[11px]">
                +{animalCount - 5} more
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border/40 pt-3 text-[11px] text-muted-foreground">
        <span>{catalogue.currency}</span>
        <span>{new Date(catalogue.updatedAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
