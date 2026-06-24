import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, UserRole } from "@/types";
import { useVenueStore } from "@/store/venueStore";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  refreshToken: string | null;

  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole, phone: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

// Mock users for demo
let MOCK_USERS: Record<string, User> = {
  "admin@futsalpro.com": {
    id: "u1",
    name: "Alex Ramos",
    email: "admin@futsalpro.com",
    role: "vendor_admin",
    tenantId: "t1",
    createdAt: new Date().toISOString(),
    phone: undefined,
  },
  "player@futsalpro.com": {
    id: "u2",
    name: "Jordan Mith",
    email: "player@futsalpro.com",
    role: "player",
    tenantId: "t1",
    createdAt: new Date().toISOString(),
    phone: undefined,
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      refreshToken: null,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await fetch('/api/v1/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message ?? 'Invalid credentials');
          }

          const res = await response.json();
          const { data } = res;

          const userData: User = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
           // tenantId: data.user.tenantId ?? undefined,
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
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      signup: async (name, email, password, role, phone) => {
        set({ isLoading: true });
        try {
          const response = await fetch('/api/v1/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, name, phone, role }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message ?? 'Signup failed');
          }

           const res = await response.json();

          

          const { data } = res;
           console.log("data",data);

           const userData: User = {
             id: data.user.id,
             name: data.user.name,
             email: data.user.email,
             role: data.user.role,
             //tenantId: data.user.tenantId ?? undefined,
             createdAt: data.user.createdAt,
             avatarUrl: data.user.avatarUrl ?? undefined,
             phone: data.user.phone ?? undefined,
           };
           set({ 
             user: userData, 
             isAuthenticated: true, 
             isLoading: false,
             accessToken: data.accessToken,
             refreshToken: data.refreshToken
           });
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
    { name: "futsal-auth" }
  )
);