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
  logout: () => Promise<void>;
}

export const useUserStore = create(
  persist<UserState>(
    set => ({
      user: null,
      isAuthenticated: false,
      setUser: user => set({ user, isAuthenticated: true }),
      logout: async () => {
        try {
          const response = await fetch("http://localhost:20000/api/logout", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            console.error("Erreur lors de la déconnexion");
          }

          set({ user: null, isAuthenticated: false });
        } catch (error) {
          console.error("Erreur lors de la déconnexion:", error);
          set({ user: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
