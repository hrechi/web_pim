import { NavLink } from 'react-router-dom';
import { Logo } from '@/components/common/logo';
import { NAV_GROUPS } from '@/config/navigation';
import { cn } from '@/lib/utils';

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  return (
    <aside className="flex h-full w-72 flex-col border-r border-border/60 bg-surface">
      <div className="px-6 py-5">
        <Logo />
      </div>
      <nav className="flex-1 overflow-y-auto px-4 pb-6">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-5">
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {group.label}
            </p>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                      isActive
                        ? 'bg-gradient-brand text-white shadow-soft'
                        : 'text-ink/80 hover:bg-muted/60 hover:text-ink',
                    )
                  }
                >
                  <item.icon className="size-[18px] shrink-0" />
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.comingSoon ? (
                    <span className="rounded-full bg-warning/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-warning">
                      Soon
                    </span>
                  ) : null}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t border-border/60 px-6 py-4 text-xs text-muted-foreground">
        © {new Date().getFullYear()} Fieldly
      </div>
    </aside>
  );
}
