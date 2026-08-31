import { tokenStorage } from "@/lib/tokenStorage";
import { request } from "@/lib/api";
import type { AuthResponse } from "@/types/auth";
import type { LoginCredentials, RegisterCredentials, ChangePassword } from "@/types/auth";

export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  const response = await request<AuthResponse>("post", "/auth/register", credentials);
  tokenStorage.set(response.accessToken);
  return response;
};


export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await request<AuthResponse>("post", "/auth/login", credentials);
  tokenStorage.set(response.accessToken);
  return response;
};


export const logout = async (): Promise<void> => {
  try {
    await request<{ message: string }>("post", "/auth/logout");
  } finally {
    tokenStorage.remove();
  }
};

// Función para actualizar la contraseña del usuario autenticado.
export const updatePassword = async (credentials: ChangePassword): Promise<{ message: string }> => {
  // Enviamos PATCH a /users/me/password con las credenciales de cambio.
  return request<{ message: string }>("patch", "/users/me/password", credentials);
};
