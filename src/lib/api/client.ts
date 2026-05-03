import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import { API_BASE_URL } from '../env';

type TokenSnapshot = { accessToken: string | null; refreshToken: string | null };

type AuthHooks = {
  getTokens: () => TokenSnapshot;
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
  onAuthFailure: () => void;
};

let hooks: AuthHooks = {
  getTokens: () => ({ accessToken: null, refreshToken: null }),
  setTokens: () => {},
  onAuthFailure: () => {},
};

/** Wire the Axios client to the auth store. Called once during bootstrap. */
export function configureApiAuth(next: AuthHooks): void {
  hooks = next;
}

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  // Allow up to ~30s for AI/diagnostic endpoints.
  timeout: 30_000,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const { accessToken } = hooks.getTokens();
  if (accessToken && !config.headers.has('Authorization')) {
    config.headers.set('Authorization', `Bearer ${accessToken}`);
  }
  // Don't force JSON content type when sending FormData.
  if (config.data instanceof FormData) {
    config.headers.delete('Content-Type');
  }
  return config;
});

// ── 401 → refresh-token rotation ──────────────────────────────────────────
let refreshInflight: Promise<string | null> | null = null;

async function performRefresh(): Promise<string | null> {
  const { refreshToken } = hooks.getTokens();
  if (!refreshToken) return null;

  try {
    const resp = await axios.post<{ accessToken: string; refreshToken: string }>(
      `${API_BASE_URL}/auth/refresh`,
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
          'Content-Type': 'application/json',
        },
      },
    );
    hooks.setTokens(resp.data);
    return resp.data.accessToken;
  } catch {
    hooks.onAuthFailure();
    return null;
  }
}

api.interceptors.response.use(
  (resp) => resp,
  async (error: AxiosError) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;
    const status = error.response?.status;

    if (
      status === 401 &&
      original &&
      !original._retry &&
      !original.url?.includes('/auth/')
    ) {
      original._retry = true;
      refreshInflight = refreshInflight ?? performRefresh().finally(() => {
        refreshInflight = null;
      });
      const newToken = await refreshInflight;
      if (newToken) {
        original.headers.set('Authorization', `Bearer ${newToken}`);
        return api.request(original);
      }
    }

    return Promise.reject(error);
  },
);

// ── Convenience helpers ───────────────────────────────────────────────────
export async function apiGet<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const { data } = await api.get<T>(url, config);
  return data;
}

export async function apiPost<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const { data } = await api.post<T>(url, body, config);
  return data;
}

export async function apiPatch<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const { data } = await api.patch<T>(url, body, config);
  return data;
}

export async function apiPut<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const { data } = await api.put<T>(url, body, config);
  return data;
}

export async function apiDelete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const { data } = await api.delete<T>(url, config);
  return data;
}

/** Extract a human-friendly error message from an Axios error. */
export function getErrorMessage(err: unknown, fallback = 'Something went wrong'): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string | string[] } | undefined;
    if (data?.message) {
      return Array.isArray(data.message) ? data.message.join(', ') : data.message;
    }
    return err.message || fallback;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}
