import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, ShieldAlert, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/common/page-header';
import { LoadingState } from '@/components/common/loading-state';
import { ErrorState } from '@/components/common/error-state';
import { EmptyState } from '@/components/common/empty-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useIncidentsQuery } from '@/hooks/queries/use-incidents';
import { useNotificationsStore } from '@/stores/notifications-store';
import { mediaUrl } from '@/lib/env';
import type { Incident } from '@/services/incidents.service';

function incidentImage(i: Incident): string | undefined {
  return mediaUrl(i.imagePath ?? i.imageUrl);
}

function incidentTime(i: Incident): string {
  const raw = i.detectedAt ?? i.timestamp;
  if (!raw) return '';
  const date = new Date(raw as string);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return date.toLocaleDateString();
}

function incidentLabel(i: Incident): string {
  if (i.title) return i.title;
  if (i.type) return i.type.charAt(0).toUpperCase() + i.type.slice(1).toLowerCase() + ' detected';
  return 'Security incident';
}

const severityVariant: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
  LOW: 'default',
  MEDIUM: 'warning',
  HIGH: 'danger',
  CRITICAL: 'danger',
};

export function NotificationsPage() {
  const { data, isLoading, isError, refetch } = useIncidentsQuery();
  const markSeen = useNotificationsStore((s) => s.markSeen);
  const clearAll = useNotificationsStore((s) => s.clearAll);
  const clearedIds = useNotificationsStore((s) => s.clearedIds);

  const allIncidents = Array.isArray(data) ? data : [];
  const visible = allIncidents.filter((i) => !clearedIds.includes(i.id));

  // Mark all as seen as soon as the page opens
  useEffect(() => {
    markSeen();
  }, [markSeen]);

  const handleClearAll = () => {
    clearAll(allIncidents.map((i) => i.id));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Bell className="size-5" />}
        title="Notifications"
        description="Recent security alerts from your farm."
        actions={
          visible.length > 0 ? (
            <Button variant="ghost" size="sm" onClick={handleClearAll} className="text-muted-foreground hover:text-danger">
              <Trash2 className="size-4" />
              Clear all
            </Button>
          ) : undefined
        }
      />

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={<Bell className="size-6" />}
          title="All caught up"
          description="No new notifications. New security incidents will appear here."
        />
      ) : (
        <div className="space-y-2">
          {visible.map((i) => {
            const img = incidentImage(i);
            const time = incidentTime(i);
            const label = incidentLabel(i);
            return (
              <Link key={i.id} to={`/app/security/incidents/${i.id}`}>
                <div className="flex items-center gap-4 rounded-2xl border border-border/60 bg-surface px-4 py-3 transition-all hover:bg-muted/40">
                  {img ? (
                    <img
                      src={img}
                      alt="Incident"
                      className="size-12 shrink-0 rounded-xl object-cover border border-border/40"
                    />
                  ) : (
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-danger/10">
                      <ShieldAlert className="size-5 text-danger" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-medium text-sm text-ink truncate">{label}</span>
                      {i.severity && (
                        <Badge variant={severityVariant[i.severity] ?? 'default'} className="text-[10px] px-1.5 py-0">
                          {i.severity}
                        </Badge>
                      )}
                    </div>
                    {i.description && (
                      <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                        {i.description}
                      </p>
                    )}
                  </div>

                  {time && (
                    <span className="shrink-0 text-xs text-muted-foreground">{time}</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
