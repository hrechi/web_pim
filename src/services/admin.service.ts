import { apiGet, apiPost, apiDelete } from '@/lib/api/client';
import type { AuthUser } from '@/types/auth';

export interface ContactMessage {
  id: number;
  email: string;
  message: string;
  timestamp: string;
  status?: 'unread' | 'read';
}

export interface Rating {
  id: number;
  rating: number;
  comment: string;
  timestamp: string;
  userEmail?: string;
}

export interface AdminStats {
  totalMessages: number;
  unreadMessages: number;
  totalRatings: number;
  averageRating: number;
  totalAccounts: number;
}

export const adminService = {
  // Contact Messages
  getContactMessages: () => apiGet<ContactMessage[]>('/admin/contacts'),
  getContactMessage: (id: number) => apiGet<ContactMessage>(`/admin/contacts/${id}`),
  markAsRead: (id: number) => apiPost<ContactMessage>(`/admin/contacts/${id}/read`, {}),
  deleteContactMessage: (id: number) => apiDelete<{ message: string }>(`/admin/contacts/${id}`),

  // Ratings
  getRatings: () => apiGet<Rating[]>('/admin/ratings'),
  getRating: (id: number) => apiGet<Rating>(`/admin/ratings/${id}`),
  deleteRating: (id: number) => apiDelete<{ message: string }>(`/admin/ratings/${id}`),

  // Farmer Accounts
  getFarmerAccounts: async () => {
    try {
      console.log('[adminService] Fetching farmers from backend...');
      // Try to fetch from backend first
      const accounts = await apiGet<AuthUser[]>('/user/farmers');
      console.log('[adminService] Success! Found accounts:', accounts);
      return accounts;
    } catch (error) {
      console.error('[adminService] Backend call failed:', error);
      console.log('[adminService] Falling back to localStorage');
      // Fallback to localStorage
      return adminService.getLocalFarmerAccounts();
    }
  },

  deleteFarmerAccountFromBackend: (userId: string) => 
    apiDelete<{ message: string }>(`/user/${userId}`),

  // Stats
  getStats: () => apiGet<AdminStats>('/admin/stats'),

  // Local storage fallback (for development)
  getLocalContactMessages: () => {
    const contacts = localStorage.getItem('contactMessages');
    return contacts ? JSON.parse(contacts) : [];
  },

  getLocalRatings: () => {
    const ratings = localStorage.getItem('ratings');
    return ratings ? JSON.parse(ratings) : [];
  },

  getLocalFarmerAccounts: () => {
    const accounts = localStorage.getItem('farmerAccounts');
    return accounts ? JSON.parse(accounts) : [];
  },

  deleteFarmerAccount: (userId: string) => {
    const accounts = adminService.getLocalFarmerAccounts();
    const updated = accounts.filter((acc: AuthUser) => acc.id !== userId);
    localStorage.setItem('farmerAccounts', JSON.stringify(updated));
  },

  getLocalStats: () => {
    const messages = adminService.getLocalContactMessages();
    const ratings = adminService.getLocalRatings();
    const accounts = adminService.getLocalFarmerAccounts();
    const unreadMessages = messages.filter((m: ContactMessage) => m.status === 'unread').length;
    const averageRating = ratings.length
      ? ratings.reduce((sum: number, r: Rating) => sum + r.rating, 0) / ratings.length
      : 0;

    return {
      totalMessages: messages.length,
      unreadMessages,
      totalRatings: ratings.length,
      averageRating: Math.round(averageRating * 10) / 10,
      totalAccounts: accounts.length,
    };
  },
};
