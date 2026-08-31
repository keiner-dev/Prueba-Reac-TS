import { useParams, useNavigate, Link } from "react-router-dom";
import { useFetch } from "@/hooks/useFetch";
import { updateEvent } from "@/services/eventService";
import EventForm from "@/components/EventForm";
import ErrorMessage from "@/components/ErrorMessage";
import type { Event, EventPayload } from "@/types/event";
import type { Category } from "@/types/category";

export default function EventEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: event, loading, error } = useFetch<Event>(id ? `/events/${id}` : "");
  const { data: categories, loading: catLoading, error: catError } = useFetch<Category[]>("/categories");

  const handleSubmit = async (data: EventPayload, isEdit: boolean, eventId?: string) => {
    if (isEdit && eventId) {
      await updateEvent(eventId, data);
    }
    navigate(`/eventos/${eventId}`);
  };

  return (
    <div className="mx-auto max-w-lg">
      {id && (
        <Link to={`/eventos/${id}`} className="text-[#536a2d] hover:underline">
          ← Volver al evento
        </Link>
      )}

      {loading || catLoading ? (
        <p className="mt-6 text-center text-gray-500">Cargando…</p>
      ) : error ? (
        <div className="mt-6">
          <ErrorMessage message={error.message} title="No se pudo cargar el evento" />
        </div>
      ) : catError ? (
        <div className="mt-6">
          <ErrorMessage message={catError.message} title="No se pudieron cargar las categorías" />
        </div>
      ) : event ? (
        <div className="mt-6">
          <EventForm
            categories={categories ?? []}
            initialEvent={event}
            onSubmit={handleSubmit}
          />
        </div>
      ) : null}
    </div>
  );
}
