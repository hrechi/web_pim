export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-surface/60">
      <div className="container py-8 sm:py-12">
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-ink">Fieldly</span>
            <span>· {new Date().getFullYear()}</span>
          </div>
          <p>Built with care for the people who feed us.</p>
          <p className="text-xs">
            <a href="/admin/login" className="hover:text-ink font-medium">Admin</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
