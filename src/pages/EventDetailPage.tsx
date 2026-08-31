import { useParams, Link, useNavigate } from "react-router-dom";
import { useFetch } from "@/hooks/useFetch";
import { deleteEvent } from "@/services/eventService";
import ErrorMessage from "@/components/ErrorMessage";
import FavoriteButton from "@/components/FavoriteButton";
import { useAuth } from "@/context/auth-context";
import type { Event } from "@/types/event";
import { formatPrice } from "@/utils/format";

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: event, loading, error, refetch } = useFetch<Event>(id ? `/events/${id}` : "");

  const handleDelete = async () => {
    if (!window.confirm("¿Seguro que deseas eliminar este evento?")) return;
    try {
      if (id) await deleteEvent(id);
      navigate("/");
    } catch {
      alert("No se pudo eliminar el evento.");
    }
  };

  const formattedDate = event?.date
    ? new Date(event.date).toLocaleString("es-ES", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Sin fecha";

  return (
    <div>
      <Link to="/" className="text-[#536a2d] hover:underline">
        ← Volver
      </Link>

      {loading ? (
        <p className="mt-6 text-center text-gray-500">Cargando evento…</p>
      ) : error ? (
        <div className="mt-6">
          <ErrorMessage message={error.message} title="No se pudo cargar el evento" />
        </div>
      ) : event ? (
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <div className="flex h-80 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
            {event.images?.[0] ? (
              <img
                src={event.images[0]}
                alt={event.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <span className="text-gray-400">Sin imagen</span>
            )}
          </div>

          <div>
            <h1 className="text-3xl font-bold">{event.name}</h1>
            {event.category?.name && <p className="text-sm text-gray-500">{event.category.name}</p>}
            <p className="mt-4 text-lg font-semibold text-[#536a2d]">{formattedDate}</p>
            {event.location && <p className="mt-1 text-gray-700">{event.location}</p>}
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-700">
              <span className="rounded bg-[#edf3df] px-2 py-1 font-medium text-[#2f4610]">
                {formatPrice(event.price ?? 0)}
              </span>
              <span className="rounded bg-[#edf3df] px-2 py-1 font-medium text-[#2f4610]">
                {event.capacity ?? 0} asistentes
              </span>
            </div>
            {event.description && <p className="mt-4 text-gray-700">{event.description}</p>}

            <div className="mt-6">
              <FavoriteButton productId={event.id} isFavorited={false} onChange={refetch} />
            </div>

            {user && (
              <div className="mt-6 flex gap-3">
                <Link
                  to={`/eventos/${event.id}/editar`}
                  className="rounded bg-[#536a2d] px-4 py-2 text-white hover:bg-[#405024]"
                >
                  Editar
                </Link>
                <button
                  onClick={handleDelete}
                  className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
