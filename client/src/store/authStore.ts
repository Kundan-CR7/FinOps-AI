import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  hasSeenWelcome: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  markWelcomeSeen: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      hasSeenWelcome: false,
      login: (user, token) => set({ user, token, isAuthenticated: true, hasSeenWelcome: false }),
      logout: () => set({ user: null, token: null, isAuthenticated: false, hasSeenWelcome: false }),
      markWelcomeSeen: () => set({ hasSeenWelcome: true }),
    }),
    {
      name: 'finops-auth-storage', // name of the item in the storage (must be unique)
    }
  )
);
