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
        <Route
          path="soil"
          element={
            <Suspended>
              <SoilPage />
            </Suspended>
          }
        />
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
        <Route path="calendar" element={<ComingSoonPage title="Calendar" />} />
        <Route path="catalogues" element={<ComingSoonPage title="Catalogues" />} />
        <Route path="equipment" element={<ComingSoonPage title="Equipment" />} />
        <Route path="herds" element={<ComingSoonPage title="Herds & flocks" />} />
        <Route path="team" element={<ComingSoonPage title="Team" />} />
        <Route path="inventory" element={<ComingSoonPage title="Inventory" />} />
        <Route path="agronomist" element={<ComingSoonPage title="AI agronomist" />} />
        <Route path="finance" element={<ComingSoonPage title="Finance" />} />
        <Route path="marketplace" element={<ComingSoonPage title="Marketplace" />} />
        <Route path="community" element={<ComingSoonPage title="Community" />} />
        <Route path="settings" element={<ComingSoonPage title="Settings" />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
