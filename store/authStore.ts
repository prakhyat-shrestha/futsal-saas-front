import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, UserRole } from "@/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

// Mock users for demo
const MOCK_USERS: Record<string, User> = {
  "admin@futsalpro.com": {
    id: "u1",
    name: "Alex Ramos",
    email: "admin@futsalpro.com",
    role: "vendor_admin",
    tenantId: "t1",
    createdAt: new Date().toISOString(),
  },
  "player@futsalpro.com": {
    id: "u2",
    name: "Jordan Mith",
    email: "player@futsalpro.com",
    role: "player",
    tenantId: "t1",
    createdAt: new Date().toISOString(),
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, _password) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 800)); // simulate API
        const user = MOCK_USERS[email];
        if (!user) throw new Error("Invalid credentials");
        set({ user, isAuthenticated: true, isLoading: false });
      },

      signup: async (name, email, _password, role) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 800));
        const newUser: User = {
          id: `u_${Date.now()}`,
          name,
          email,
          role,
          tenantId: `t_${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set({ user: newUser, isAuthenticated: true, isLoading: false });
      },

      logout: () => set({ user: null, isAuthenticated: false }),

      setUser: (user) => set({ user, isAuthenticated: true }),
    }),
    { name: "futsal-auth" }
  )
);