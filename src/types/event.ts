import type { Category } from "./category";

export interface Event {
  id: string;
  name: string;
  description?: string;
  date: string;
  location: string;
  price: number;
  capacity: number;
  categoryId: string;
  category?: Category;
  images?: string[];
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EventQueryParams {
  search?: string;
  categoryId?: string;
}

export interface EventPayload {
  name: string;
  description?: string;
  date: string;
  location: string;
  price: string | number;
  capacity: string | number;
  categoryId: string;
  images?: string[];
}
