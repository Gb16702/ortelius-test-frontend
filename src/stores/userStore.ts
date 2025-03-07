import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type User = {
  id: string;
  username: string;
  credits: number;
} | null;

interface UserState {
  user: User;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useUserStore = create(
  persist<UserState>(
    set => ({
      user: null,
      isAuthenticated: false,
      setUser: user => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
