import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sprout, Beef, ShieldAlert, Tractor, X } from 'lucide-react';
import { useParcelsQuery } from '@/hooks/queries/use-parcels';
import { useAnimalsQuery } from '@/hooks/queries/use-animals';
import { useIncidentsQuery } from '@/hooks/queries/use-incidents';
import { useAssetsQuery } from '@/hooks/queries/use-assets';
import { cn } from '@/lib/utils';

interface Result {
  id: string;
  label: string;
  sublabel?: string;
  icon: React.ReactNode;
  href: string;
}

export function GlobalSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: parcelsData } = useParcelsQuery();
  const { data: animalsData } = useAnimalsQuery();
  const { data: incidentsData } = useIncidentsQuery();
  const { data: assetsData } = useAssetsQuery();

  const parcels = Array.isArray(parcelsData) ? parcelsData : [];
  const animals = Array.isArray(animalsData) ? animalsData : [];
  const incidents = Array.isArray(incidentsData) ? incidentsData : [];
  const assets = Array.isArray(assetsData) ? assetsData : [];

  const results = useMemo<Result[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const out: Result[] = [];

    // Parcels
    parcels
      .filter((p) => p.location?.toLowerCase().includes(q) || p.soilType?.toLowerCase().includes(q))
      .slice(0, 3)
      .forEach((p) =>
        out.push({
          id: `parcel-${p.id}`,
          label: p.location,
          sublabel: p.soilType ?? 'Parcel',
          icon: <Sprout className="size-4 text-primary" />,
          href: `/app/parcels/${p.id}`,
        }),
      );

    // Animals
    animals
      .filter(
        (a) =>
          a.name?.toLowerCase().includes(q) ||
          (a.animalType as string)?.toLowerCase().includes(q) ||
          (a.breed as string)?.toLowerCase().includes(q) ||
          (a.tagNumber as string)?.toLowerCase().includes(q),
      )
      .slice(0, 3)
      .forEach((a) =>
        out.push({
          id: `animal-${a.id}`,
          label: a.name ?? 'Animal',
          sublabel: [a.animalType, a.breed].filter(Boolean).join(' · ') as string,
          icon: <Beef className="size-4 text-accent" />,
          href: `/app/animals`,
        }),
      );

    // Incidents
    incidents
      .filter(
        (i) =>
          (i.type as string)?.toLowerCase().includes(q) ||
          (i.title as string)?.toLowerCase().includes(q) ||
          (i.description as string)?.toLowerCase().includes(q),
      )
      .slice(0, 3)
      .forEach((i) => {
        const label = (i.title as string) || ((i.type as string) ? `${(i.type as string).charAt(0).toUpperCase()}${(i.type as string).slice(1)} detected` : 'Incident');
        out.push({
          id: `incident-${i.id}`,
          label,
          sublabel: i.timestamp ? new Date(i.timestamp as string).toLocaleDateString() : 'Incident',
          icon: <ShieldAlert className="size-4 text-danger" />,
          href: `/app/security/incidents/${i.id}`,
        });
      });

    // Assets
    assets
      .filter(
        (a) =>
          a.name?.toLowerCase().includes(q) ||
          a.brand?.toLowerCase().includes(q) ||
          a.model?.toLowerCase().includes(q) ||
          a.serialNumber?.toLowerCase().includes(q),
      )
      .slice(0, 3)
      .forEach((a) =>
        out.push({
          id: `asset-${a.id}`,
          label: a.name,
          sublabel: [a.brand, a.model].filter(Boolean).join(' · '),
          icon: <Tractor className="size-4 text-warning" />,
          href: `/app/equipment`,
        }),
      );

    return out;
  }, [query, parcels, animals, incidents, assets]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (href: string) => {
    navigate(href);
    setQuery('');
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setQuery('');
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className="relative hidden flex-1 max-w-md md:block">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => query && setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Search parcels, animals, incidents…"
        className="w-full rounded-xl border border-border/60 bg-bg/60 py-2 pl-9 pr-8 text-sm text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all"
      />
      {query && (
        <button
          onClick={() => { setQuery(''); setOpen(false); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-ink"
        >
          <X className="size-3.5" />
        </button>
      )}

      {/* Results dropdown */}
      {open && query.trim() && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl border border-border/60 bg-surface shadow-card overflow-hidden">
          {results.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
              No results for "<span className="font-medium text-ink">{query}</span>"
            </div>
          ) : (
            <ul className="py-1.5 max-h-80 overflow-y-auto">
              {results.map((r) => (
                <li key={r.id}>
                  <button
                    onClick={() => handleSelect(r.href)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-muted/50"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/60">
                      {r.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{r.label}</p>
                      {r.sublabel && (
                        <p className="truncate text-xs text-muted-foreground">{r.sublabel}</p>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
