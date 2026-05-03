import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { selectIsAuthenticated, useAuthStore } from '@/stores/auth-store';
import type { UserRole } from '@/types/auth';
import { LoadingState } from '@/components/common/loading-state';

export function RequireAuth() {
  const location = useLocation();
  const hydrated = useAuthStore((s) => s.hydrated);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  if (!hydrated) {
    return <LoadingState label="Preparing your workspace…" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/sign-in" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

interface RequireRoleProps {
  roles: UserRole[];
}

export function RequireRole({ roles }: RequireRoleProps) {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to="/auth/sign-in" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/app/dashboard" replace />;
  return <Outlet />;
}

export function RedirectIfAuthenticated() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const hydrated = useAuthStore((s) => s.hydrated);
  if (!hydrated) return <LoadingState />;
  if (isAuthenticated) return <Navigate to="/app/dashboard" replace />;
  return <Outlet />;
}
