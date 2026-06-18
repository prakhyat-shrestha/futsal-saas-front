import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  userId: string;
  $id: string;
  $createdAt: string;
}

interface ProfileStore {
  profile: Profile | null;
  setProfile: (profile: Profile) => void;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      profile: null,
      setProfile: (profile) => set({ profile }),
      clearProfile: () => set({ profile: null }),
    }),
    {
      name: "profile-storage", // Key under which the state is saved in localStorage
    }
  )
);