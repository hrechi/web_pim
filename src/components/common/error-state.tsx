import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'Please try again in a moment.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-danger/30 bg-danger/5 px-6 py-12 text-center">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-danger/10 text-danger">
        <AlertTriangle className="size-6" />
      </div>
      <h3 className="text-h3 font-semibold text-ink">{title}</h3>
      <p className="max-w-md text-sm text-muted-foreground">{message}</p>
      {onRetry ? (
        <Button onClick={onRetry} variant="outline" className="mt-2">
          <RefreshCcw className="size-4" /> Try again
        </Button>
      ) : null}
    </div>
  );
}
