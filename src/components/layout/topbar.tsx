import { Bell, LogOut, Menu, Search, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/stores/auth-store';
import { useUiStore } from '@/stores/ui-store';
import { useNotificationsStore } from '@/stores/notifications-store';
import { authService } from '@/services/auth.service';
import { initials } from '@/lib/utils';
import { mediaUrl } from '@/lib/env';
import { useIncidentsQuery } from '@/hooks/queries/use-incidents';
import { FieldSwitcher } from '@/components/common/field-switcher';

export function Topbar() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const clear = useAuthStore((s) => s.clear);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const lastSeenAt = useNotificationsStore((s) => s.lastSeenAt);
  const clearedIds = useNotificationsStore((s) => s.clearedIds);

  // Show badge if any non-cleared incident is newer than the last time user opened notifications
  const { data: incidents } = useIncidentsQuery();
  const hasUnseen = Array.isArray(incidents) && incidents.some((i) => {
    if (clearedIds.includes(i.id)) return false;
    const t = i.detectedAt ?? i.timestamp;
    if (!t) return false;
    if (!lastSeenAt) return true;
    return new Date(t as string) > new Date(lastSeenAt);
  });

  const handleSignOut = async () => {
    try {
      await authService.signOut();
    } catch {
      /* ignore */
    }
    clear();
    navigate('/auth/sign-in', { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-surface/80 px-4 backdrop-blur md:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleSidebar}>
        <Menu className="size-5" />
        <span className="sr-only">Open menu</span>
      </Button>
      <div className="hidden flex-1 max-w-md md:block">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search parcels, animals, incidents…" className="pl-9" />
        </div>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <FieldSwitcher />
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => navigate('/app/notifications')}
          aria-label="Notifications"
        >
          <Bell className="size-5" />
          {hasUnseen && (
            <span className="absolute right-2 top-2 size-2 rounded-full bg-danger" />
          )}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full p-1 pr-3 transition-colors hover:bg-muted/50 focus-ring">
              <Avatar className="size-9">
                {user?.profilePicture ? <AvatarImage src={mediaUrl(user.profilePicture)} alt={user.name} /> : null}
                <AvatarFallback>{initials(user?.name)}</AvatarFallback>
              </Avatar>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold leading-none text-ink">{user?.name ?? 'Account'}</p>
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  {user?.role?.toLowerCase() ?? 'guest'}
                </p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{user?.email ?? user?.phone ?? 'Signed in'}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => navigate('/app/settings')}>
              <UserRound className="size-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={handleSignOut}
              className="text-danger focus:text-danger"
            >
              <LogOut className="size-4" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
