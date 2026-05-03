import * as React from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  hint?: string;
  icon?: React.ReactNode;
  trend?: { value: string; positive?: boolean };
  className?: string;
}

export function StatCard({ label, value, hint, icon, trend, className }: StatCardProps) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold text-ink">{value}</p>
          {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
        </div>
        {icon ? (
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {icon}
          </div>
        ) : null}
      </div>
      {trend ? (
        <p
          className={cn(
            'mt-3 inline-flex items-center gap-1 text-xs font-semibold',
            trend.positive ? 'text-success' : 'text-danger',
          )}
        >
          {trend.value}
        </p>
      ) : null}
      <div className="pointer-events-none absolute -right-8 -top-8 size-24 rounded-full bg-gradient-brand opacity-0 blur-2xl transition-opacity group-hover:opacity-30" />
    </div>
  );
}
