
import type { UserResponse } from "./user";


export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}


export type LoginCredentials = Omit<RegisterCredentials, "name">;


export interface AuthResponse {
  accessToken: string;
  user: UserResponse;
}

export interface ChangePassword {
  currentPassword: string;
  newPassword: string;
}
