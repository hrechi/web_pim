import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: number;
  withText?: boolean;
}

export function Logo({ className, size = 36, withText = true }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div
        className="flex items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-soft"
        style={{ width: size, height: size }}
        aria-hidden
      >
        <svg viewBox="0 0 24 24" fill="none" className="size-2/3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2C7 6 4 10 4 14a8 8 0 0 0 16 0c0-4-3-8-8-12Z" />
          <path d="M12 22V12" />
        </svg>
      </div>
      {withText ? (
        <div className="leading-none">
          <p className="font-display text-lg font-bold text-ink">Fieldly</p>
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Smart Farming
          </p>
        </div>
      ) : null}
    </div>
  );
}
