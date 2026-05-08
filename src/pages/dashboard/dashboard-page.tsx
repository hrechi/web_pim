import { Link } from 'react-router-dom';
import {
  Beef,
  LayoutDashboard,
  Mountain,
  ShieldAlert,
  Sprout,
  Users,
} from 'lucide-react';
import { PageHeader } from '@/components/common/page-header';
import { StatCard } from '@/components/common/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth-store';
import { useFieldStore } from '@/stores/field-store';
import { useParcelsQuery } from '@/hooks/queries/use-parcels';
import { useAnimalsQuery } from '@/hooks/queries/use-animals';
import { useIncidentsQuery } from '@/hooks/queries/use-incidents';
import { useStaffQuery } from '@/hooks/queries/use-staff';
import { useSoilSamplesQuery } from '@/hooks/queries/use-soil';
import { Skeleton } from '@/components/ui/skeleton';
import { API_ORIGIN } from '@/lib/env';

const QUICK_LINKS = [
  { to: '/app/parcels', label: 'Parcels', icon: Sprout, hint: 'Manage your land' },
  { to: '/app/animals', label: 'Livestock', icon: Beef, hint: 'Track your herd' },
  { to: '/app/security/incidents', label: 'Security', icon: ShieldAlert, hint: 'Live incidents' },
];

export function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const fieldId = useFieldStore((s) => s.selectedFieldId) ?? undefined;
  const selectedFieldName = useFieldStore((s) => s.selectedField?.name);
  const parcels = useParcelsQuery();
  const animals = useAnimalsQuery(fieldId);
  const incidents = useIncidentsQuery();
  const staff = useStaffQuery();
  const soil = useSoilSamplesQuery(fieldId);

  const parcelList = Array.isArray(parcels.data) ? parcels.data : [];
  const animalList = Array.isArray(animals.data) ? animals.data : [];
  const incidentList = Array.isArray(incidents.data) ? incidents.data : [];
  const staffList = Array.isArray(staff.data) ? staff.data : [];
  const soilList = Array.isArray(soil.data) ? soil.data : [];

  const parcelCount = parcelList.length;
  const animalCount = animalList.length;
  const openIncidents = incidentList.filter((i) => (i.status ?? 'OPEN') !== 'RESOLVED').length;
  const staffCount = staffList.length;
  const totalArea = parcelList.reduce((acc, p) => acc + (Number(p.areaSize) || 0), 0);

  return (
    <div className="space-y-8">
      <PageHeader
        icon={<LayoutDashboard className="size-5" />}
        title={`Welcome back, ${user?.name?.split(' ')[0] ?? 'farmer'}`}
        description={selectedFieldName ? `Viewing data for field: ${selectedFieldName}` : "Here's a quick snapshot of your operation today."}
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
              hint={selectedFieldName ? `In ${selectedFieldName}` : 'Across your farm'}
              icon={<Beef className="size-5" />}
            />
            <StatCard
              label="Open incidents"
              value={openIncidents}
              hint={openIncidents === 0 ? 'All clear' : 'Needs attention'}
              icon={<ShieldAlert className="size-5" />}
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
          <CardTitle>Soil samples</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/app/soil">View all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {soil.isLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : soilList.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border/60 bg-bg/40 p-6 text-center text-sm text-muted-foreground">
              No soil samples yet. Submit one from the mobile app.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {soilList.slice(0, 4).map((s) => {
                const n = typeof s.nutrients?.N === 'number' ? s.nutrients.N : s.nutrients?.nitrogen;
                const p = typeof s.nutrients?.P === 'number' ? s.nutrients.P : s.nutrients?.phosphorus;
                const k = typeof s.nutrients?.K === 'number' ? s.nutrients.K : s.nutrients?.potassium;
                return (
                  <div key={s.id} className="rounded-xl border border-border/60 bg-bg/40 p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-[11px]">{s.soilType ?? 'Unknown'}</Badge>
                      {s.createdAt && (
                        <span className="text-[11px] text-muted-foreground">
                          {new Date(s.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
                      {[
                        { label: 'pH', val: s.ph },
                        { label: 'N', val: n },
                        { label: 'P', val: p },
                        { label: 'K', val: k },
                        { label: 'Moist', val: s.soilMoisture, unit: '%' },
                        { label: 'Temp', val: s.temperature, unit: '°' },
                      ].map(({ label, val, unit }) => (
                        <div key={label} className="rounded-lg bg-surface p-1.5">
                          <p className="text-[9px] uppercase tracking-wide text-muted-foreground">{label}</p>
                          <p className="font-semibold text-ink">
                            {val == null ? '—' : `${val}${unit ?? ''}`}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Team Members ({staffCount})</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/app/team">Manage</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {staff.isLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : staffList.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border/60 bg-bg/40 p-6 text-center text-sm text-muted-foreground">
              No staff members added yet. Add team members to get started.
            </p>
          ) : (
            <ul className="divide-y divide-border/60">
              {staffList.slice(0, 5).map((s) => (
                <li key={s.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    {s.imagePath && (
                      <img
                        src={`${API_ORIGIN}${s.imagePath}`}
                        alt={s.name}
                        className="size-10 rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23999"%3E%3Ccircle cx="12" cy="8" r="4"/%3E%3Cpath d="M12 14c-6 0-8 3-8 3v3h16v-3s-2-3-8-3z"/%3E%3C/svg%3E';
                        }}
                      />
                    )}
                    <div>
                      <p className="font-medium text-ink">{s.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : 'Recently added'}
                      </p>
                    </div>
                  </div>
                  <Users className="size-5 text-muted-foreground" />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
