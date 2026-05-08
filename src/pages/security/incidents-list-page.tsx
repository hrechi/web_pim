import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { PageHeader } from '@/components/common/page-header';
import { LoadingState } from '@/components/common/loading-state';
import { ErrorState } from '@/components/common/error-state';
import { EmptyState } from '@/components/common/empty-state';
import { Badge } from '@/components/ui/badge';
import { useIncidentsQuery } from '@/hooks/queries/use-incidents';
import { mediaUrl } from '@/lib/env';
import type { Incident } from '@/services/incidents.service';

const severityVariant: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
  LOW: 'default',
  MEDIUM: 'warning',
  HIGH: 'danger',
  CRITICAL: 'danger',
};

function incidentImage(i: Incident): string | undefined {
  return mediaUrl(i.imagePath ?? i.imageUrl);
}

function incidentTime(i: Incident): string | undefined {
  const raw = i.detectedAt ?? i.timestamp;
  return raw ? new Date(raw).toLocaleString() : undefined;
}

function incidentLabel(i: Incident): string {
  if (i.title) return i.title;
  if (i.type) return i.type.charAt(0).toUpperCase() + i.type.slice(1).toLowerCase() + ' detected';
  return 'Security incident';
}

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
          {incidents.map((i) => {
            const img = incidentImage(i);
            const time = incidentTime(i);
            const label = incidentLabel(i);
            return (
              <Link key={i.id} to={`/app/security/incidents/${i.id}`}>
                <div className="flex items-center gap-4 rounded-2xl border border-border/60 bg-surface p-4 transition-all hover:-translate-y-0.5 hover:shadow-card">
                  {/* Thumbnail */}
                  {img ? (
                    <img
                      src={img}
                      alt="Incident"
                      className="size-16 shrink-0 rounded-xl object-cover border border-border/40"
                    />
                  ) : (
                    <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-danger/10">
                      <ShieldAlert className="size-6 text-danger" />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-ink truncate">{label}</h3>
                      {i.severity && (
                        <Badge variant={severityVariant[i.severity] ?? 'default'}>
                          {i.severity}
                        </Badge>
                      )}
                      <Badge variant="outline">{i.status ?? 'OPEN'}</Badge>
                    </div>
                    {i.description && (
                      <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                        {i.description}
                      </p>
                    )}
                    {time && (
                      <p className="mt-1 text-xs text-muted-foreground">{time}</p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
