import {
  useEffect, 
  useState, 
  type ReactNode, 
} from "react";

import { AuthContext, type AuthContextValue } from "./auth-context";
import * as authService from "@/services/authService";
import { api } from "@/lib/api";
import { tokenStorage } from "@/lib/tokenStorage";
import type { UserResponse } from "@/types/user";
import type { LoginCredentials, RegisterCredentials } from "@/types/auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      const token = tokenStorage.get();
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const me = await api.get<UserResponse>("/users/me");
        setUser(me.data);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadSession();
  }, []);


  const handleLogin = async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);
    setUser(response.user);
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
  };

  const handleRegister = async (credentials: RegisterCredentials) => {
    const response = await authService.register(credentials);
    setUser(response.user);
  };

  const value: AuthContextValue = {
    user: user, 
    role: user ? user.role : null, 
    isLoading: isLoading, 
    login: handleLogin, 
    register: handleRegister, 
    logout: handleLogout, 
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
