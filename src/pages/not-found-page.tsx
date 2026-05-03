import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/common/logo';

export function NotFoundPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-bg p-6 text-center">
      <Logo />
      <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-card">
        <Compass className="size-7" />
      </div>
      <div>
        <h1 className="text-display font-bold text-ink">404</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          We couldn&apos;t find the page you were looking for. It may have moved or never existed.
        </p>
      </div>
      <Button asChild variant="gradient">
        <Link to="/app/dashboard">Take me home</Link>
      </Button>
    </div>
  );
}
