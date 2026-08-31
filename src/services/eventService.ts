import { request } from "@/lib/api";
import type { Event, EventPayload, EventQueryParams } from "@/types/event";

export const getEvents = async (params: EventQueryParams = {}): Promise<Event[]> => {
  const query = new URLSearchParams();

  if (params.search) query.set("search", params.search);
  if (params.categoryId) query.set("categoryId", params.categoryId);

  const qs = query.toString();
  return request<Event[]>("get", `/events${qs ? `?${qs}` : ""}`);
};

export const getEvent = async (id: string): Promise<Event> => {
  return request<Event>("get", `/events/${id}`);
};

export const createEvent = async (payload: EventPayload): Promise<Event> => {
  return request<Event>("post", "/events", payload);
};

export const updateEvent = async (id: string, payload: EventPayload): Promise<Event> => {
  return request<Event>("patch", `/events/${id}`, payload);
};

export const deleteEvent = async (id: string): Promise<void> => {
  await request<void>("delete", `/events/${id}`);
};

export type { Event, EventPayload, EventQueryParams };
