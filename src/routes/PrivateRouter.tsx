import { redirect } from "react-router-dom";
import { api } from "@/lib/api";
import { tokenStorage } from "@/lib/tokenStorage";
import type { UserResponse } from "@/types/user";

export async function requireAuth() {
  const token = tokenStorage.get();

  if (!token) {
    throw redirect("/login");
  }

  try {
    await api.get<UserResponse>("/users/me");
    return null;
  } catch {
    tokenStorage.remove();
    throw redirect("/login");
  }
}

export async function requireAdmin() {
  const token = tokenStorage.get();

  if (!token) {
    throw redirect("/login");
  }

  try {
    const { data } = await api.get<UserResponse>("/users/me");

    if (data.role !== "admin") {
      throw redirect("/");
    }

    return null;
  } catch (error) {
    if (typeof error === "object" && error && "status" in error) {
      const redirectError = error as { status?: number };
      if (redirectError.status === 302) {
        throw error;
      }
    }

    tokenStorage.remove();
    throw redirect("/login");
  }
}
