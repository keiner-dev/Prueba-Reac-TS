import { tokenStorage } from "@/lib/tokenStorage";
import axios from "axios";
import { ApiError, toApiError } from "./errors";


export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
});


api.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      tokenStorage.remove();
      window.location.href = "auth/login";
    }
    return Promise.reject(error);
  }
);


export default api;


export async function request<T>(
  method: "get" | "post" | "patch" | "delete", 
  url: string, 
  data?: unknown 
): Promise<T> {
  try {
    const response = await api.request<T>({ method, url, data });
    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    if (axios.isAxiosError(error)) {
 
      const status = error.response?.status;
      const rawMessage = error.response?.data?.message;
      if (status === undefined) {
        throw new ApiError("network", "No se pudo conectar con el servidor");
      }

      const message = Array.isArray(rawMessage)
        ? rawMessage.join(", ") 
        : (rawMessage ?? `Error ${status}`); 
      throw ApiError.fromStatus(status, message, error.response?.data);
    }
    throw toApiError(error);
  }
}
