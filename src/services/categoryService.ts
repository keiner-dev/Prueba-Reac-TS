import { request } from "@/lib/api";
import type { Category } from "@/types/category";

export interface CategoryPayload {
  name: string;
  description?: string;
}

export const getCategories = async (): Promise<Category[]> => {
  return request<Category[]>("get", "/categories");
};

export const getCategory = async (id: string): Promise<Category> => {
  return request<Category>("get", `/categories/${id}`);
};

export const createCategory = async (payload: CategoryPayload): Promise<Category> => {
  return request<Category>("post", "/categories", payload);
};

export const updateCategory = async (id: string, payload: CategoryPayload): Promise<Category> => {
  return request<Category>("patch", `/categories/${id}`, payload);
};


export const deleteCategory = async (id: string): Promise<void> => {
  await request<void>("delete", `/categories/${id}`);
};
