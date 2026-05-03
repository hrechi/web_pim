import { Link } from 'react-router-dom';
import {
  Beef,
  CloudSun,
  LayoutDashboard,
  Mountain,
  ShieldAlert,
  Sprout,
  Stethoscope,
} from 'lucide-react';
import { PageHeader } from '@/components/common/page-header';
import { StatCard } from '@/components/common/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth-store';
import { useParcelsQuery } from '@/hooks/queries/use-parcels';
import { useAnimalsQuery } from '@/hooks/queries/use-animals';
import { useIncidentsQuery } from '@/hooks/queries/use-incidents';
import { Skeleton } from '@/components/ui/skeleton';

const QUICK_LINKS = [
  { to: '/app/parcels', label: 'Parcels', icon: Sprout, hint: 'Manage your land' },
  { to: '/app/animals', label: 'Livestock', icon: Beef, hint: 'Track your herd' },
  { to: '/app/weather', label: 'Weather', icon: CloudSun, hint: '7-day forecast' },
  { to: '/app/plant-doctor', label: 'Plant Doctor', icon: Stethoscope, hint: 'AI diagnoses' },
  { to: '/app/soil', label: 'Soil', icon: Mountain, hint: 'Sample analysis' },
  { to: '/app/security/incidents', label: 'Security', icon: ShieldAlert, hint: 'Live incidents' },
];

export function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const parcels = useParcelsQuery();
  const animals = useAnimalsQuery();
  const incidents = useIncidentsQuery();

  const parcelList = Array.isArray(parcels.data) ? parcels.data : [];
  const animalList = Array.isArray(animals.data) ? animals.data : [];
  const incidentList = Array.isArray(incidents.data) ? incidents.data : [];

  const parcelCount = parcelList.length;
  const animalCount = animalList.length;
  const openIncidents = incidentList.filter((i) => (i.status ?? 'OPEN') !== 'RESOLVED').length;
  const totalArea = parcelList.reduce((acc, p) => acc + (Number(p.areaSize) || 0), 0);

  return (
    <div className="space-y-8">
      <PageHeader
        icon={<LayoutDashboard className="size-5" />}
        title={`Welcome back, ${user?.name?.split(' ')[0] ?? 'farmer'}`}
        description="Here's a quick snapshot of your operation today."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {parcels.isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))
        ) : (
          <>
            <StatCard
              label="Parcels"
              value={parcelCount}
              hint={`${totalArea.toFixed(1)} ha total`}
              icon={<Sprout className="size-5" />}
            />
            <StatCard
              label="Animals"
              value={animalCount}
              hint="Across your farm"
              icon={<Beef className="size-5" />}
            />
            <StatCard
              label="Open incidents"
              value={openIncidents}
              hint={openIncidents === 0 ? 'All clear' : 'Needs attention'}
              icon={<ShieldAlert className="size-5" />}
            />
            <StatCard
              label="Weather"
              value="Live"
              hint="Per-parcel forecasts"
              icon={<CloudSun className="size-5" />}
            />
          </>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Jump back in</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {QUICK_LINKS.map((q) => (
              <Link
                key={q.to}
                to={q.to}
                className="group flex items-center gap-4 rounded-2xl border border-border/60 bg-surface p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft"
              >
                <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-gradient-brand group-hover:text-white">
                  <q.icon className="size-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-ink">{q.label}</p>
                  <p className="text-xs text-muted-foreground">{q.hint}</p>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent incidents</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/app/security/incidents">View all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {incidents.isLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : incidentList.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border/60 bg-bg/40 p-6 text-center text-sm text-muted-foreground">
              No incidents detected. Your farm is secure.
            </p>
          ) : (
            <ul className="divide-y divide-border/60">
              {incidentList.slice(0, 5).map((i) => (
                <li key={i.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-ink">{i.title ?? 'Incident'}</p>
                    <p className="text-xs text-muted-foreground">
                      {i.severity ?? '—'} · {i.status ?? 'OPEN'}
                    </p>
                  </div>
                  <Link
                    to={`/app/security/incidents/${i.id}`}
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    Open →
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
