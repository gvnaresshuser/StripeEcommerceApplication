import { create } from "zustand";
import {
  getMe,
  login,
  logout,
  type LoginData,
  type User,
} from "../api/authApi";

interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;

  loginUser: (data: LoginData) => Promise<void>;
  fetchMe: () => Promise<void>;
  logoutUser: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  isAuthenticated: false,

  loginUser: async (data) => {
    set({ loading: true });

    try {
      await login(data);

      const response = await getMe();

      set({
        user: response.user,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        user: null,
        isAuthenticated: false,
      });

      throw error;
    }
  },

  fetchMe: async () => {
    set({ loading: true });

    try {
      const response = await getMe();

      set({
        user: response.user,
        isAuthenticated: true,
        loading: false,
      });
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  },

  logoutUser: async () => {
    try {
      await logout();
    } finally {
      set({
        user: null,
        isAuthenticated: false,
      });
    }
  },
}));

export default useAuthStore;