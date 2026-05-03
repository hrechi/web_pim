import {
  LayoutDashboard,
  Sprout,
  Beef,
  CloudSun,
  Stethoscope,
  Mountain,
  Bell,
  Calendar,
  Users,
  Wallet,
  Store,
  ShieldAlert,
  Bot,
  Settings,
  MessagesSquare,
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
      { to: '/app/calendar', label: 'Calendar', icon: Calendar, comingSoon: true },
    ],
  },
  {
    label: 'Farm',
    items: [
      { to: '/app/parcels', label: 'Parcels', icon: Sprout },
      { to: '/app/weather', label: 'Weather', icon: CloudSun },
      { to: '/app/plant-doctor', label: 'Plant Doctor', icon: Stethoscope },
      { to: '/app/soil', label: 'Soil Analysis', icon: Mountain },
      { to: '/app/catalogues', label: 'Catalogues', icon: ScrollText, comingSoon: true },
      { to: '/app/equipment', label: 'Equipment', icon: Tractor, comingSoon: true },
    ],
  },
  {
    label: 'Livestock',
    items: [
      { to: '/app/animals', label: 'Animals', icon: Beef },
      { to: '/app/herds', label: 'Herds', icon: Building2, comingSoon: true },
    ],
  },
  {
    label: 'Operations',
    items: [
      { to: '/app/team', label: 'Workers', icon: Users, comingSoon: true },
      { to: '/app/inventory', label: 'Inventory', icon: Package, comingSoon: true },
      { to: '/app/agronomist', label: 'Agronomist', icon: Bot, comingSoon: true },
    ],
  },
  {
    label: 'Finance',
    items: [
      { to: '/app/finance', label: 'Finance', icon: Wallet, comingSoon: true },
      { to: '/app/marketplace', label: 'Marketplace', icon: Store, comingSoon: true },
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
      { to: '/app/community', label: 'Community', icon: MessagesSquare, comingSoon: true },
      { to: '/app/settings', label: 'Settings', icon: Settings, comingSoon: true },
    ],
  },
];
