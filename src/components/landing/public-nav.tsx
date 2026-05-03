import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, LogIn, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { selectIsAuthenticated, useAuthStore } from '@/stores/auth-store';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#modules', label: 'Modules' },
  { href: '#how', label: 'How it works' },
  { href: '#testimonials', label: 'Stories' },
  { href: '#contact', label: 'Contact Us' },
  { href: '#about', label: 'About Us' },
];

export function PublicNav() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const user = useAuthStore((s) => s.user);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-border/60 bg-surface/85 backdrop-blur-xl shadow-soft'
          : 'bg-transparent',
      )}
    >
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <img src="/image/logo.png" alt="Fieldly Logo" className="size-16 rounded-2xl shadow-soft transition-transform group-hover:scale-110" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-xl px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-primary/5 hover:text-primary"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <span className="hidden text-xs text-ink sm:inline">
                Hi, <span className="font-semibold text-ink">{user?.name?.split(' ')[0]}</span>
              </span>
              <Button asChild variant="gradient" size="sm" className="animate-pulse-glow">
                <Link to="/app/dashboard">
                  <LayoutDashboard className="size-4" />
                  <span className="hidden sm:inline">Open dashboard</span>
                  <span className="sm:hidden">Dashboard</span>
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button
                disabled
                variant="ghost"
                size="sm"
                title="Sign in to unlock the dashboard"
                className="hidden cursor-not-allowed text-muted-foreground sm:inline-flex"
              >
                <Lock className="size-4" /> Dashboard
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link to="/auth/sign-in">
                  <LogIn className="size-4" /> Sign in
                </Link>
              </Button>
              <Button asChild variant="gradient" size="sm">
                <Link to="/auth/sign-up">Get started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
