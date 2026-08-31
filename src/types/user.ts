export type Role = "admin" | "user";


export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}


export interface LoginUser {
  email: string;
  password: string;
}


export interface RegisterUser extends LoginUser {
  name: string;
}
