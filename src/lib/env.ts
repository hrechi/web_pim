/**
 * Resolved API base URL.
 *
 * - In development we leave VITE_API_BASE_URL empty and rely on Vite's dev
 *   proxy: relative `/api` calls hit `http://localhost:3000` (see vite.config.ts).
 * - In production set `VITE_API_BASE_URL` to the absolute URL of the NestJS
 *   API including the `/api` suffix, e.g. `https://api.fieldly.com/api`.
 */
export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') || '/api';

/**
 * Origin of the API (without the `/api` suffix), used for serving uploaded
 * media (`/uploads/...`) and Socket.io namespaces (`/siren`, etc.).
 */
export const API_ORIGIN: string = (() => {
  try {
    if (API_BASE_URL.startsWith('http')) {
      return API_BASE_URL.replace(/\/api$/, '');
    }
    // Relative — same origin as the page.
    return window.location.origin;
  } catch {
    return '';
  }
})();

export function mediaUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith('/')) return `${API_ORIGIN}${path}`;
  return `${API_ORIGIN}/${path}`;
}
