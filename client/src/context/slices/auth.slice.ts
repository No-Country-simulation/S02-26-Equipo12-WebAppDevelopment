import { type StateCreator } from "zustand";
import type { Rider } from "../../interfaces/auth.interface";

export const AUTH_STATUS = {
  UNAUTHENTICATED: "unauthenticated",
  AUTHENTICATED: "authenticated",
  LOADING: "loading",
} as const;

export type AuthStatus = (typeof AUTH_STATUS)[keyof typeof AUTH_STATUS];

export interface AuthSlice {
  user: Rider | null;
  state: AuthStatus;

  login: (user: Rider) => void;
  logout: () => void;
}

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  user: null,
  state: AUTH_STATUS.LOADING,

  login(user: Rider) {
    set({
      user,
      state: AUTH_STATUS.AUTHENTICATED,
    });
  },
  logout() {
    set({
      user: null,
      state: AUTH_STATUS.UNAUTHENTICATED,
    });
  },
});
