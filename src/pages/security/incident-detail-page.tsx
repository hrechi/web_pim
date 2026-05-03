import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ShieldAlert, Siren, Volume2, VolumeX } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/common/page-header';
import { LoadingState } from '@/components/common/loading-state';
import { ErrorState } from '@/components/common/error-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useIncidentQuery } from '@/hooks/queries/use-incidents';
import { createSocket } from '@/lib/api/socket';
import { mediaUrl } from '@/lib/env';

export function IncidentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError, refetch } = useIncidentQuery(id);
  const [sirenActive, setSirenActive] = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = createSocket();
    socket.connect();
    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('trigger_siren', () => {
      setSirenActive(true);
      toast.warning('🚨 Siren triggered');
    });
    socket.on('stop_siren', () => {
      setSirenActive(false);
      toast.success('Siren stopped');
    });
    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, []);

  const triggerSiren = () => {
    const socket = createSocket();
    socket.connect();
    socket.emit('trigger_siren', { timestamp: new Date().toISOString() });
    setTimeout(() => socket.disconnect(), 500);
  };
  const stopSiren = () => {
    const socket = createSocket();
    socket.connect();
    socket.emit('stop_siren', { timestamp: new Date().toISOString() });
    setTimeout(() => socket.disconnect(), 500);
  };

  if (isLoading) return <LoadingState />;
  if (isError || !data) return <ErrorState onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/app/security/incidents">
          <ArrowLeft className="size-4" /> Back to incidents
        </Link>
      </Button>
      <PageHeader
        icon={<ShieldAlert className="size-5" />}
        title={data.title ?? 'Incident'}
        description={data.description}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant={connected ? 'success' : 'outline'}>
              {connected ? 'Live' : 'Offline'}
            </Badge>
            {sirenActive ? (
              <Button onClick={stopSiren} variant="destructive">
                <VolumeX className="size-4" /> Stop siren
              </Button>
            ) : (
              <Button onClick={triggerSiren} variant="gradient">
                <Siren className="size-4" /> Trigger siren
              </Button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Evidence</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.imageUrl ? (
              <img
                src={mediaUrl(data.imageUrl)}
                alt="Incident"
                className="w-full rounded-2xl border border-border/60"
              />
            ) : null}
            {data.videoUrl ? (
              <video
                controls
                src={mediaUrl(data.videoUrl)}
                className="w-full rounded-2xl border border-border/60"
              />
            ) : null}
            {data.audioUrl ? (
              <audio controls src={mediaUrl(data.audioUrl)} className="w-full" />
            ) : null}
            {!data.imageUrl && !data.videoUrl && !data.audioUrl ? (
              <p className="text-sm text-muted-foreground">No media attached.</p>
            ) : null}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Row label="Severity" value={data.severity} />
            <Row label="Status" value={data.status ?? 'OPEN'} />
            <Row
              label="Detected"
              value={data.detectedAt ? new Date(data.detectedAt).toLocaleString() : '—'}
            />
            <Row label="Parcel" value={data.parcelId ?? '—'} />
            <div className="rounded-xl bg-bg/60 p-3 text-xs text-muted-foreground">
              <div className="mb-1 inline-flex items-center gap-1 font-semibold uppercase tracking-wide">
                <Volume2 className="size-3" /> Realtime
              </div>
              You&apos;re subscribed to the siren channel. Events broadcast here will appear
              instantly.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/40 py-2 last:border-0">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="font-medium text-ink">{value ?? '—'}</span>
    </div>
  );
}
