import { apiGet, apiPost } from '@/lib/api/client';
import type { AuthResponse, AuthTokens, SignInPayload, SignUpPayload, AuthUser } from '@/types/auth';

export const authService = {
  signIn: (payload: SignInPayload) => apiPost<AuthResponse>('/auth/signin', payload),
  signUp: (payload: SignUpPayload) => apiPost<AuthResponse>('/auth/signup', payload),
  signOut: () => apiPost<{ message: string }>('/auth/signout'),
  refresh: (refreshToken: string) =>
    apiPost<AuthTokens>(
      '/auth/refresh',
      {},
      { headers: { Authorization: `Bearer ${refreshToken}` } },
    ),
  me: () => apiGet<AuthUser>('/user/profile'),
};
