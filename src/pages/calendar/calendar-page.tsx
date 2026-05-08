import { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Sprout, Wheat } from 'lucide-react';
import { PageHeader } from '@/components/common/page-header';
import { LoadingState } from '@/components/common/loading-state';
import { ErrorState } from '@/components/common/error-state';
import { EmptyState } from '@/components/common/empty-state';
import { Badge } from '@/components/ui/badge';
import { useParcelsQuery } from '@/hooks/queries/use-parcels';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CropEvent {
  id: string;
  cropName: string;
  parcelName: string;
  type: 'planting' | 'harvest';
  date: Date;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function firstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}
function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}
function isToday(d: Date) {
  return isSameDay(d, new Date());
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CalendarPage() {
  const { data, isLoading, isError, refetch } = useParcelsQuery();
  const parcels = Array.isArray(data) ? data : [];

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  // Build all crop events from parcels
  const events = useMemo<CropEvent[]>(() => {
    const result: CropEvent[] = [];
    for (const parcel of parcels) {
      for (const crop of parcel.crops ?? []) {
        if (crop.plantingDate) {
          result.push({
            id: `${crop.id}-plant`,
            cropName: crop.cropName ?? 'Crop',
            parcelName: parcel.location,
            type: 'planting',
            date: new Date(crop.plantingDate),
          });
        }
        if (crop.expectedHarvestDate) {
          result.push({
            id: `${crop.id}-harvest`,
            cropName: crop.cropName ?? 'Crop',
            parcelName: parcel.location,
            type: 'harvest',
            date: new Date(crop.expectedHarvestDate),
          });
        }
      }
    }
    return result;
  }, [parcels]);

  // Events for the current month view
  const eventsThisMonth = useMemo(
    () => events.filter((e) => e.date.getFullYear() === year && e.date.getMonth() === month),
    [events, year, month],
  );

  // Events for selected day
  const selectedEvents = useMemo(
    () => selectedDay ? events.filter((e) => isSameDay(e.date, selectedDay)) : [],
    [events, selectedDay],
  );

  // Map day → events for dot rendering
  const eventsByDay = useMemo(() => {
    const map = new Map<number, CropEvent[]>();
    for (const e of eventsThisMonth) {
      const d = e.date.getDate();
      if (!map.has(d)) map.set(d, []);
      map.get(d)!.push(e);
    }
    return map;
  }, [eventsThisMonth]);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
    setSelectedDay(null);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
    setSelectedDay(null);
  };

  const totalDays = daysInMonth(year, month);
  const startOffset = firstDayOfMonth(year, month);
  // Pad to full weeks
  const totalCells = Math.ceil((startOffset + totalDays) / 7) * 7;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<CalendarIcon className="size-5" />}
        title="Calendar"
        description="Planting and harvest dates for all your crops."
      />

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : events.length === 0 && parcels.length === 0 ? (
        <EmptyState
          icon={<CalendarIcon className="size-6" />}
          title="No crops yet"
          description="Add parcels and crops from the mobile app to see them on the calendar."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Calendar grid */}
          <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-surface p-5 shadow-soft">
            {/* Month nav */}
            <div className="mb-5 flex items-center justify-between">
              <button
                onClick={prevMonth}
                className="flex size-8 items-center justify-center rounded-lg hover:bg-muted/60 transition-colors"
              >
                <ChevronLeft className="size-4" />
              </button>
              <h2 className="font-display text-base font-bold text-ink">
                {MONTH_NAMES[month]} {year}
              </h2>
              <button
                onClick={nextMonth}
                className="flex size-8 items-center justify-center rounded-lg hover:bg-muted/60 transition-colors"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>

            {/* Day headers */}
            <div className="mb-2 grid grid-cols-7 text-center">
              {DAY_NAMES.map((d) => (
                <div key={d} className="py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {d}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: totalCells }).map((_, idx) => {
                const dayNum = idx - startOffset + 1;
                const isValid = dayNum >= 1 && dayNum <= totalDays;
                const cellDate = isValid ? new Date(year, month, dayNum) : null;
                const dayEvents = isValid ? (eventsByDay.get(dayNum) ?? []) : [];
                const hasPlanting = dayEvents.some((e) => e.type === 'planting');
                const hasHarvest = dayEvents.some((e) => e.type === 'harvest');
                const isSelected = cellDate && selectedDay && isSameDay(cellDate, selectedDay);
                const todayCell = cellDate && isToday(cellDate);

                return (
                  <button
                    key={idx}
                    disabled={!isValid}
                    onClick={() => cellDate && setSelectedDay(isSelected ? null : cellDate)}
                    className={`relative flex flex-col items-center rounded-xl p-1.5 transition-all min-h-[44px] ${
                      !isValid ? 'opacity-0 pointer-events-none' :
                      isSelected ? 'bg-primary text-white shadow-sm' :
                      todayCell ? 'bg-primary/10 text-primary font-bold' :
                      'hover:bg-muted/60 text-ink'
                    }`}
                  >
                    <span className="text-sm leading-none">{isValid ? dayNum : ''}</span>
                    {/* Event dots */}
                    {dayEvents.length > 0 && (
                      <div className="mt-1 flex gap-0.5">
                        {hasPlanting && (
                          <span className={`size-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-primary'}`} />
                        )}
                        {hasHarvest && (
                          <span className={`size-1.5 rounded-full ${isSelected ? 'bg-white/70' : 'bg-warning'}`} />
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center gap-4 border-t border-border/40 pt-4">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="size-2.5 rounded-full bg-primary" />
                Planting
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="size-2.5 rounded-full bg-warning" />
                Harvest
              </div>
            </div>
          </div>

          {/* Sidebar: selected day or upcoming */}
          <div className="space-y-4">
            {selectedDay ? (
              <div className="rounded-2xl border border-border/60 bg-surface p-5 shadow-soft">
                <h3 className="mb-4 font-display font-bold text-ink">
                  {selectedDay.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                </h3>
                {selectedEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No events on this day.</p>
                ) : (
                  <div className="space-y-3">
                    {selectedEvents.map((e) => (
                      <EventCard key={e.id} event={e} />
                    ))}
                  </div>
                )}
              </div>
            ) : null}

            {/* Upcoming events */}
            <div className="rounded-2xl border border-border/60 bg-surface p-5 shadow-soft">
              <h3 className="mb-4 font-display font-bold text-ink">Upcoming</h3>
              {(() => {
                const upcoming = events
                  .filter((e) => e.date >= today)
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .slice(0, 8);
                return upcoming.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No upcoming events.</p>
                ) : (
                  <div className="space-y-3">
                    {upcoming.map((e) => (
                      <EventCard key={e.id} event={e} showDate />
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Event card ───────────────────────────────────────────────────────────────

function EventCard({ event, showDate }: { event: CropEvent; showDate?: boolean }) {
  const isPlanting = event.type === 'planting';
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border/40 bg-bg/60 p-3">
      <div className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg ${
        isPlanting ? 'bg-primary/15 text-primary' : 'bg-warning/15 text-warning'
      }`}>
        {isPlanting ? <Sprout className="size-3.5" /> : <Wheat className="size-3.5" />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-medium text-sm text-ink truncate">{event.cropName}</span>
          <Badge
            variant={isPlanting ? 'default' : 'warning' as any}
            className="text-[10px] px-1.5 py-0 shrink-0"
          >
            {isPlanting ? 'Planting' : 'Harvest'}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground truncate">{event.parcelName}</p>
        {showDate && (
          <p className="mt-0.5 text-xs font-medium text-muted-foreground">
            {event.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        )}
      </div>
    </div>
  );
}
