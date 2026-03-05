import { useEffect } from "react";
import { useBoundStore } from "../../context";
import type { Rider } from "../../interfaces/auth.interface";

interface Props {
  initialUser?: Rider | null;
  isAuthenticated?: boolean;
}

export const AuthProvider = ({ initialUser, isAuthenticated }: Props) => {
  const login = useBoundStore((state) => state.login);
  const logout = useBoundStore((state) => state.logout);

  useEffect(() => {
    if (isAuthenticated && initialUser) {
      login(initialUser);
    } else if (!isAuthenticated) {
      logout();
    }
  }, [initialUser, isAuthenticated, login, logout]);

  return null;
};