import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiRequest } from '@/lib/api';
import { User, UserRole } from '@/types';
import { useVenueStore } from '@/store/venueStore';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  refreshToken: string | null;

  error: string | null;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;

  login: (email: string, password: string) => Promise<User>;
  signup: (name: string, email: string, password: string, role: UserRole, phone: string) => Promise<User>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      refreshToken: null,

      error: null,
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const data = await apiRequest<{
            user: {
              id: string;
              name: string;
              email: string;
              role: UserRole;
              createdAt: string;
              avatarUrl?: string;
              phone?: string;
            };
            accessToken: string;
            refreshToken: string;
          }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
          });

          const userData: User = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            createdAt: data.user.createdAt,
            avatarUrl: data.user.avatarUrl ?? undefined,
            phone: data.user.phone ?? undefined,
          };

          set({
            user: userData,
            isAuthenticated: true,
            isLoading: false,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          });
          return userData;
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      signup: async (name, email, password, role, phone) => {
        set({ isLoading: true });
        try {
          const data = await apiRequest<{
            user: {
              id: string;
              name: string;
              email: string;
              role: UserRole;
              createdAt: string;
              avatarUrl?: string;
              phone?: string;
            };
            accessToken: string;
            refreshToken: string;
          }>('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, name, phone, role }),
          });

          const userData: User = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            createdAt: data.user.createdAt,
            avatarUrl: data.user.avatarUrl ?? undefined,
            phone: data.user.phone ?? undefined,
          };

          set({
            user: userData,
            isAuthenticated: true,
            isLoading: false,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          });
          return userData;
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, accessToken: null, refreshToken: null });
        useVenueStore.getState().reset();
      },

      setUser: (user) => set({ user, isAuthenticated: true }),
    }),
    {
      name: 'futsal-auth',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
