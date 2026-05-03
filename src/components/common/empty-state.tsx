import * as React from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/70 bg-surface/50 px-6 py-14 text-center',
        className,
      )}
    >
      {icon ? (
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          {icon}
        </div>
      ) : null}
      <h3 className="text-h3 font-semibold text-ink">{title}</h3>
      {description ? (
        <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
