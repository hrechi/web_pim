import { useEffect, useRef, useState, type ReactNode } from 'react';
import { configureApiAuth } from '@/lib/api/client';
import { useAuthStore } from '@/stores/auth-store';
import { authService } from '@/services/auth.service';

interface AuthBootstrapProps {
  children: ReactNode;
}

export function AuthBootstrap({ children }: AuthBootstrapProps) {
  const [ready, setReady] = useState(false);
  const wired = useRef(false);

  useEffect(() => {
    if (wired.current) return;
    wired.current = true;

    configureApiAuth({
      getTokens: () => {
        const s = useAuthStore.getState();
        return { accessToken: s.accessToken, refreshToken: s.refreshToken };
      },
      setTokens: (tokens) => useAuthStore.getState().setTokens(tokens),
      onAuthFailure: () => useAuthStore.getState().clear(),
    });

    const { accessToken, user } = useAuthStore.getState();
    if (accessToken && !user) {
      authService
        .me()
        .then((u) => useAuthStore.getState().setUser(u))
        .catch(() => useAuthStore.getState().clear())
        .finally(() => setReady(true));
    } else {
      setReady(true);
    }
  }, []);

  if (!ready) return null;
  return <>{children}</>;
}
