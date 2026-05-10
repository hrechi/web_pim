import { Beef } from 'lucide-react';
import { PageHeader } from '@/components/common/page-header';
import { LoadingState } from '@/components/common/loading-state';
import { ErrorState } from '@/components/common/error-state';
import { EmptyState } from '@/components/common/empty-state';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAnimalsQuery } from '@/hooks/queries/use-animals';
import { useFieldStore } from '@/stores/field-store';
import { initials } from '@/lib/utils';
import { mediaUrl } from '@/lib/env';

export function AnimalsListPage() {
  const fieldId = useFieldStore((s) => s.selectedFieldId) ?? undefined;
  const { data, isLoading, isError, refetch } = useAnimalsQuery(fieldId);
  const animals = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Beef className="size-5" />}
        title="Livestock"
        description="Every animal across your herds and flocks."
      />
      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : animals.length === 0 ? (
        <EmptyState
          icon={<Beef className="size-6" />}
          title="No animals yet"
          description="Register animals from the mobile app to see them here."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {animals.map((animal) => (
            <Card key={animal.id} className="transition-all hover:-translate-y-0.5 hover:shadow-card">
              <CardContent className="flex items-center gap-4 p-5">
                <Avatar className="size-14">
                  {animal.profileImage ? (
                    <AvatarImage src={mediaUrl(animal.profileImage)} alt={animal.name ?? ''} />
                  ) : null}
                  <AvatarFallback>{initials(animal.name ?? animal.animalType)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-ink">{animal.name ?? 'Unnamed'}</h3>
                    {animal.status ? <Badge variant="success">{animal.status}</Badge> : null}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {animal.animalType ?? '—'}
                    {animal.breed ? ` · ${animal.breed}` : ''}
                    {animal.sex ? ` · ${animal.sex}` : ''}
                  </p>
                </div>
                {animal.birthWeightKg ? (
                  <div className="text-right">
                    <p className="text-sm font-semibold text-ink">{animal.birthWeightKg} kg</p>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
