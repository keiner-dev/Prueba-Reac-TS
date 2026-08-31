import { request } from "@/lib/api";
import type { Favorite } from "@/types/favorites";

export const getFavorites = async (): Promise<Favorite[]> => {
  return request<Favorite[]>("get", "/favorites");
};

export const addFavorite = async (productId: string): Promise<void> => {
  await request<void>("post", `/favorites/${productId}`);
};


export const removeFavorite = async (productId: string): Promise<void> => {
  await request<void>("delete", `/favorites/${productId}`);
};
