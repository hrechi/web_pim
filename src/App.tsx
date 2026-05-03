import { AuthBootstrap } from '@/components/auth/auth-bootstrap';
import { AppRoutes } from '@/routes';

export function App() {
  return (
    <AuthBootstrap>
      <AppRoutes />
    </AuthBootstrap>
  );
}
