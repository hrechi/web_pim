import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, LogIn, Lock, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { selectIsAuthenticated, useAuthStore } from '@/stores/auth-store';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#modules', label: 'Modules' },
  { href: '#how', label: 'How it works' },
  { href: '#testimonials', label: 'Stories' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#contact', label: 'Contact Us' },
  { href: '#about', label: 'About Us' },
];

export function PublicNav() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const user = useAuthStore((s) => s.user);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-300',
          scrolled || mobileOpen
            ? 'border-b border-border/60 bg-surface/95 backdrop-blur-xl shadow-soft'
            : 'bg-transparent',
        )}
      >
        <div className="container flex h-20 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0" onClick={closeMobile}>
            <img src="/image/logo.png" alt="Fieldly Logo" className="h-16 w-auto object-contain transition-transform group-hover:scale-110" />
          </Link>

          {/* Desktop nav */}
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

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <span className="hidden text-xs text-ink sm:inline">
                  Hi, <span className="font-semibold">{user?.name?.split(' ')[0]}</span>
                </span>
                <Button asChild variant="gradient" size="sm">
                  <Link to="/app/dashboard">
                    <LayoutDashboard className="size-4" /> Open dashboard
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button disabled variant="ghost" size="sm" className="cursor-not-allowed text-muted-foreground">
                  <Lock className="size-4" /> Dashboard
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/auth/sign-in"><LogIn className="size-4" /> Sign in</Link>
                </Button>
                <Button asChild variant="gradient" size="sm">
                  <Link to="/auth/sign-up">Get started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile: CTA + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            {isAuthenticated ? (
              <Button asChild variant="gradient" size="sm">
                <Link to="/app/dashboard" onClick={closeMobile}>
                  <LayoutDashboard className="size-4" />
                </Link>
              </Button>
            ) : (
              <Button asChild variant="gradient" size="sm">
                <Link to="/auth/sign-up" onClick={closeMobile}>Get started</Link>
              </Button>
            )}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="flex size-9 items-center justify-center rounded-xl border border-border/60 bg-surface/80 text-ink transition-colors hover:bg-muted/60"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border/60 bg-surface/98 backdrop-blur-xl px-4 pb-6 pt-3">
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={closeMobile}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-ink transition-colors hover:bg-primary/5 hover:text-primary"
                >
                  {l.label}
                </a>
              ))}
            </nav>
            {!isAuthenticated && (
              <div className="mt-4 flex flex-col gap-2 border-t border-border/40 pt-4">
                <Button asChild variant="outline" className="w-full" onClick={closeMobile}>
                  <Link to="/auth/sign-in"><LogIn className="size-4" /> Sign in</Link>
                </Button>
                <Button asChild variant="gradient" className="w-full" onClick={closeMobile}>
                  <Link to="/auth/sign-up">Get started free</Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
}
