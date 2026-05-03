import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { PageHeader } from '@/components/common/page-header';
import { LoadingState } from '@/components/common/loading-state';
import { ErrorState } from '@/components/common/error-state';
import { EmptyState } from '@/components/common/empty-state';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useIncidentsQuery } from '@/hooks/queries/use-incidents';

const severityVariant: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
  LOW: 'default',
  MEDIUM: 'warning',
  HIGH: 'danger',
  CRITICAL: 'danger',
};

export function IncidentsListPage() {
  const { data, isLoading, isError, refetch } = useIncidentsQuery();
  const incidents = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<ShieldAlert className="size-5" />}
        title="Security incidents"
        description="Real-time intrusion and anomaly detections from your farm sensors."
      />
      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : incidents.length === 0 ? (
        <EmptyState
          icon={<ShieldAlert className="size-6" />}
          title="All clear"
          description="No incidents have been detected on your farm."
        />
      ) : (
        <div className="space-y-3">
          {incidents.map((i) => (
            <Link key={i.id} to={`/app/security/incidents/${i.id}`}>
              <Card className="transition-all hover:-translate-y-0.5 hover:shadow-card">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-danger/10 text-danger">
                    <ShieldAlert className="size-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-ink">{i.title ?? 'Incident'}</h3>
                      {i.severity ? (
                        <Badge variant={severityVariant[i.severity] ?? 'default'}>
                          {i.severity}
                        </Badge>
                      ) : null}
                      <Badge variant="outline">{i.status ?? 'OPEN'}</Badge>
                    </div>
                    {i.description ? (
                      <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                        {i.description}
                      </p>
                    ) : null}
                  </div>
                  {i.detectedAt ? (
                    <span className="text-xs text-muted-foreground">
                      {new Date(i.detectedAt).toLocaleString()}
                    </span>
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
