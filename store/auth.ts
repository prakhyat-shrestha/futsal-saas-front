import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  $id: string
  firstName: string
  lastName: string
  email: string
}

interface AuthState {
  user: User | null
  setUser: (user: User | null) => void
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      token: null,
      setToken: (token) => set({ token }),
      logout: () => set({ user: null }),
    }),
    {
      name: "auth-storage", // Persist state in localStorage
    }
  )
)