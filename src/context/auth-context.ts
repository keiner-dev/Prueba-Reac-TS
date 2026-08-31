import { createContext, useContext } from "react";
import type { UserResponse } from "@/types/user";
import type { LoginCredentials, RegisterCredentials } from "@/types/auth";


export interface AuthContextValue {
  user: UserResponse | null;
  role: UserResponse["role"] | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
}


export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  }

  return context;
}
