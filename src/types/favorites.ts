import type { Event } from "./event";

export interface Favorite {
  id: string;
  productId: string;
  userId: string;
  product: Event;
  createdAt: string;
}
