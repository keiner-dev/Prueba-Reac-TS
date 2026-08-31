import { Link } from "react-router-dom";
import type { Event } from "@/types/event";
import { firstImage, formatPrice } from "@/utils/format";
import FavoriteButton from "./FavoriteButton";

interface EventCardProps {
  event: Event;
  isFavorited?: boolean;
  onFavoritesChange?: () => void;
}

export default function EventCard({ event, isFavorited = false, onFavoritesChange }: EventCardProps) {
  const image = firstImage(event.images);
  const eventDate = event.date ? new Date(event.date).toLocaleString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }) : "Sin fecha";

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <Link to={`/eventos/${event.id}`} className="block h-48 bg-gray-100">
        {image ? (
          <img
            src={image}
            alt={event.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">{event.name}</div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <Link to={`/eventos/${event.id}`} className="font-semibold hover:underline">
          {event.name}
        </Link>
        {event.category?.name && <span className="text-xs text-gray-500">{event.category.name}</span>}
        <p className="mt-2 text-sm text-[#536a2d]">{eventDate}</p>
        {event.location && <p className="text-sm text-gray-600">{event.location}</p>}
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="font-semibold text-gray-900">{formatPrice(event.price ?? 0)}</span>
          <span className="text-gray-600">{event.capacity ?? 0} cupos</span>
        </div>
        <div className="mt-auto pt-3">
          <FavoriteButton productId={event.id} isFavorited={isFavorited} onChange={onFavoritesChange} />
        </div>
      </div>
    </div>
  );
}
