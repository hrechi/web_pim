import { Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/common/page-header';
import { LoadingState } from '@/components/common/loading-state';
import { ErrorState } from '@/components/common/error-state';
import { EmptyState } from '@/components/common/empty-state';
import { useAnimalsQuery } from '@/hooks/queries/use-animals';
import { useFieldStore } from '@/stores/field-store';
import { mediaUrl } from '@/lib/env';

const TYPE_EMOJI: Record<string, string> = {
  cow: '🐄',
  horse: '🐴',
  sheep: '🐑',
  dog: '🐕',
};

export function HerdsPage() {
  const fieldId = useFieldStore((s) => s.selectedFieldId) ?? undefined;
  const { data, isLoading, isError, refetch } = useAnimalsQuery(fieldId);
  const animals = Array.isArray(data) ? data : [];

  // Group by animalType
  const groups = animals.reduce<Record<string, typeof animals>>((acc, a) => {
    const type = (a.animalType as string) ?? 'other';
    if (!acc[type]) acc[type] = [];
    acc[type].push(a);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Building2 className="size-5" />}
        title="Herds"
        description="Your livestock grouped by type."
      />

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : animals.length === 0 ? (
        <EmptyState
          icon={<Building2 className="size-6" />}
          title="No animals yet"
          description="Add animals from the mobile app to see your herds here."
        />
      ) : (
        <div className="space-y-8">
          {Object.entries(groups).map(([type, list]) => (
            <div key={type}>
              {/* Herd header */}
              <div className="mb-4 flex items-center gap-3">
                <span className="text-2xl">{TYPE_EMOJI[type] ?? '🐾'}</span>
                <div>
                  <h2 className="font-display text-lg font-bold capitalize text-ink">{type}s</h2>
                  <p className="text-xs text-muted-foreground">{list.length} animal{list.length !== 1 ? 's' : ''}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((a) => {
                  const img = a.profileImage ? mediaUrl(a.profileImage as string) : undefined;
                  return (
                    <Link key={a.id} to={`/app/animals`}>
                      <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-surface p-4 transition-all hover:-translate-y-0.5 hover:shadow-card">
                        {/* Avatar */}
                        {img ? (
                          <img
                            src={img}
                            alt={a.name}
                            className="size-12 shrink-0 rounded-xl object-cover border border-border/40"
                          />
                        ) : (
                          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xl">
                            {TYPE_EMOJI[type] ?? '🐾'}
                          </div>
                        )}

                        {/* Info */}
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-ink truncate">{a.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {[a.breed, a.sex, a.age != null ? `${a.age}mo` : null]
                              .filter(Boolean)
                              .join(' · ')}
                          </p>
                        </div>

                        {/* Status dot */}
                        <span
                          className={`size-2.5 shrink-0 rounded-full ${
                            a.status === 'active' ? 'bg-primary' :
                            a.status === 'sold' ? 'bg-warning' : 'bg-muted-foreground'
                          }`}
                        />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
