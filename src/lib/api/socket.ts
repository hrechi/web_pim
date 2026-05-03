import { io, type Socket } from 'socket.io-client';
import { API_ORIGIN } from '../env';
import { useAuthStore } from '@/stores/auth-store';

/**
 * Build a Socket.io client for a given namespace (e.g. '/siren').
 * The current access token is sent in the auth handshake.
 */
export function createSocket(namespace = ''): Socket {
  const ns = namespace.startsWith('/') ? namespace : `/${namespace}`;
  const url = `${API_ORIGIN}${ns}`;
  const token = useAuthStore.getState().accessToken;

  return io(url, {
    transports: ['websocket'],
    autoConnect: false,
    auth: token ? { token } : undefined,
    extraHeaders: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}
