import {
  LayoutDashboard,
  Sprout,
  Beef,
  Mountain,
  Bell,
  Calendar,
  Users,
  Wallet,
  Store,
  ShieldAlert,
  Settings,
  Package,
  ScrollText,
  Tractor,
  Building2,
  type LucideIcon,
} from 'lucide-react';
import type { UserRole } from '@/types/auth';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
  comingSoon?: boolean;
  roles?: UserRole[];
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/app/notifications', label: 'Notifications', icon: Bell },
      { to: '/app/calendar', label: 'Calendar', icon: Calendar },
    ],
  },
  {
    label: 'Farm',
    items: [
      { to: '/app/parcels', label: 'Parcels', icon: Sprout },
      { to: '/app/soil', label: 'Soil Analysis', icon: Mountain },
      { to: '/app/catalogues', label: 'Catalogues', icon: ScrollText },
      { to: '/app/equipment', label: 'Equipment', icon: Tractor },
    ],
  },
  {
    label: 'Livestock',
    items: [
      { to: '/app/animals', label: 'Animals', icon: Beef },
      { to: '/app/herds', label: 'Herds', icon: Building2 },
    ],
  },
  {
    label: 'Operations',
    items: [
      { to: '/app/team', label: 'Workers', icon: Users },
      { to: '/app/inventory', label: 'Inventory', icon: Package },
    ],
  },
  {
    label: 'Finance',
    items: [
      { to: '/app/finance', label: 'Finance', icon: Wallet },
      { to: '/app/marketplace', label: 'Marketplace', icon: Store },
    ],
  },
  {
    label: 'Security',
    items: [
      { to: '/app/security/incidents', label: 'Incidents', icon: ShieldAlert },
    ],
  },
  {
    label: 'Account',
    items: [
      { to: '/app/settings', label: 'Settings', icon: Settings },
    ],
  },
];
