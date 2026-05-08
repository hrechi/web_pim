import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '@/components/layout/app-shell';
import { AuthLayout } from '@/components/layout/auth-layout';
import { RequireAuth } from '@/components/auth/guards';
import { LoadingState } from '@/components/common/loading-state';
import { ComingSoonPage } from '@/pages/stubs/coming-soon-page';
import { NotFoundPage } from '@/pages/not-found-page';

const LandingPage = lazy(() => import('@/pages/landing/landing-page'));
const SignInPage = lazy(() => import('@/pages/auth/sign-in'));
const SignUpPage = lazy(() => import('@/pages/auth/sign-up'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/forgot-password'));

const DashboardPage = lazy(() =>
  import('@/pages/dashboard/dashboard-page').then((m) => ({ default: m.DashboardPage })),
);
const ParcelsListPage = lazy(() =>
  import('@/pages/parcels/parcels-list-page').then((m) => ({ default: m.ParcelsListPage })),
);
const ParcelDetailPage = lazy(() =>
  import('@/pages/parcels/parcel-detail-page').then((m) => ({ default: m.ParcelDetailPage })),
);
const AnimalsListPage = lazy(() =>
  import('@/pages/animals/animals-list-page').then((m) => ({ default: m.AnimalsListPage })),
);
const WeatherPage = lazy(() =>
  import('@/pages/weather/weather-page').then((m) => ({ default: m.WeatherPage })),
);
const PlantDoctorPage = lazy(() =>
  import('@/pages/plant-doctor/plant-doctor-page').then((m) => ({ default: m.PlantDoctorPage })),
);
const SoilPage = lazy(() => import('@/pages/soil/soil-page').then((m) => ({ default: m.SoilPage })));
const CataloguesPage = lazy(() =>
  import('@/pages/catalogues/catalogues-page').then((m) => ({ default: m.CataloguesPage })),
);
const EquipmentPage = lazy(() =>
  import('@/pages/equipment/equipment-page').then((m) => ({ default: m.EquipmentPage })),
);
const HerdsPage = lazy(() =>
  import('@/pages/herds/herds-page').then((m) => ({ default: m.HerdsPage })),
);
const FinancePage = lazy(() =>
  import('@/pages/finance/finance-page').then((m) => ({ default: m.FinancePage })),
);
const MarketplacePage = lazy(() =>
  import('@/pages/marketplace/marketplace-page').then((m) => ({ default: m.MarketplacePage })),
);
const InventoryPage = lazy(() =>
  import('@/pages/inventory/inventory-page').then((m) => ({ default: m.InventoryPage })),
);
const SettingsPage = lazy(() =>
  import('@/pages/settings/settings-page').then((m) => ({ default: m.SettingsPage })),
);
const CalendarPage = lazy(() =>
  import('@/pages/calendar/calendar-page').then((m) => ({ default: m.CalendarPage })),
);
const NotificationsPage = lazy(() =>
  import('@/pages/notifications/notifications-page').then((m) => ({
    default: m.NotificationsPage,
  })),
);
const IncidentsListPage = lazy(() =>
  import('@/pages/security/incidents-list-page').then((m) => ({ default: m.IncidentsListPage })),
);
const IncidentDetailPage = lazy(() =>
  import('@/pages/security/incident-detail-page').then((m) => ({ default: m.IncidentDetailPage })),
);
const TeamPage = lazy(() =>
  import('@/pages/team/team-page').then((m) => ({ default: m.TeamPage })),
);
const AdminLoginPage = lazy(() => import('@/pages/admin/admin-login-page'));
const AdminDashboardPage = lazy(() => import('@/pages/admin/admin-dashboard-page'));

function Suspended({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LoadingState />}>{children}</Suspense>;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Suspended>
            <LandingPage />
          </Suspended>
        }
      />

      <Route path="/auth" element={<AuthLayout />}>
        <Route index element={<Navigate to="/auth/sign-in" replace />} />
        <Route
          path="sign-in"
          element={
            <Suspended>
              <SignInPage />
            </Suspended>
          }
        />
        <Route
          path="sign-up"
          element={
            <Suspended>
              <SignUpPage />
            </Suspended>
          }
        />
        <Route
          path="forgot-password"
          element={
            <Suspended>
              <ForgotPasswordPage />
            </Suspended>
          }
        />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/login" element={<Suspended><AdminLoginPage /></Suspended>} />
      <Route path="/admin/dashboard" element={<Suspended><AdminDashboardPage /></Suspended>} />

      <Route element={<RequireAuth />}>
        <Route path="/app" element={<AppShell />}>
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route
          path="dashboard"
          element={
            <Suspended>
              <DashboardPage />
            </Suspended>
          }
        />
        <Route
          path="parcels"
          element={
            <Suspended>
              <ParcelsListPage />
            </Suspended>
          }
        />
        <Route
          path="parcels/:id"
          element={
            <Suspended>
              <ParcelDetailPage />
            </Suspended>
          }
        />
        <Route
          path="animals"
          element={
            <Suspended>
              <AnimalsListPage />
            </Suspended>
          }
        />
        <Route
          path="weather"
          element={
            <Suspended>
              <WeatherPage />
            </Suspended>
          }
        />
        <Route
          path="plant-doctor"
          element={
            <Suspended>
              <PlantDoctorPage />
            </Suspended>
          }
        />
        <Route path="soil" element={<Suspended><SoilPage /></Suspended>} />
        <Route
          path="notifications"
          element={
            <Suspended>
              <NotificationsPage />
            </Suspended>
          }
        />
        <Route
          path="security/incidents"
          element={
            <Suspended>
              <IncidentsListPage />
            </Suspended>
          }
        />
        <Route
          path="security/incidents/:id"
          element={
            <Suspended>
              <IncidentDetailPage />
            </Suspended>
          }
        />

        {/* Coming-soon stubs aligned with NAV_GROUPS */}
        <Route path="calendar" element={<Suspended><CalendarPage /></Suspended>} />
        <Route
          path="catalogues"
          element={
            <Suspended>
              <CataloguesPage />
            </Suspended>
          }
        />
        <Route
          path="equipment"
          element={
            <Suspended>
              <EquipmentPage />
            </Suspended>
          }
        />
        <Route path="herds" element={<Suspended><HerdsPage /></Suspended>} />
        <Route
          path="team"
          element={
            <Suspended>
              <TeamPage />
            </Suspended>
          }
        />
        <Route path="inventory" element={<Suspended><InventoryPage /></Suspended>} />
        <Route path="agronomist" element={<ComingSoonPage title="AI agronomist" />} />
        <Route path="finance" element={<Suspended><FinancePage /></Suspended>} />
        <Route path="marketplace" element={<Suspended><MarketplacePage /></Suspended>} />
        <Route path="community" element={<ComingSoonPage title="Community" />} />
        <Route path="settings" element={<Suspended><SettingsPage /></Suspended>} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
