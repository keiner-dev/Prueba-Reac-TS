
import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { createEvent } from "@/services/eventService";
import EventCard from "@/components/EventCard";
import EventForm from "@/components/EventForm";
import ErrorMessage from "@/components/ErrorMessage";
import { useAuth } from "@/context/auth-context";
import type { Category } from "@/types/category";
import type { Event, EventPayload } from "@/types/event";

export default function CategoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { data: category, loading: catLoading, error: catError } = useFetch<Category>(
    id ? `/categories/${id}` : ""
  );
  const { data: events, loading: prodLoading, error: prodError, refetch } = useFetch<Event[]>(
    id ? `/events?categoryId=${id}` : ""
  );
  const { data: categories } = useFetch<Category[]>("/categories");
  const [showForm, setShowForm] = useState(false);

  const handleCreateEvent = async (data: EventPayload) => {
    await createEvent(data);
    setShowForm(false);
    refetch();
  };

  return (
    <div>
      <Link to="/categorias" className="text-[#536a2d] hover:underline">
        ← Volver a categorías
      </Link>

      {catLoading ? (
        <p className="mt-6 text-center text-gray-500">Cargando categoría…</p>
      ) : catError ? (
        <div className="mt-6">
          <ErrorMessage message={catError.message} title="No se pudo cargar la categoría" />
        </div>
      ) : category ? (
        <>
          <h1 className="mt-4 text-2xl font-bold">{category.name}</h1>
          {category.description && <p className="text-gray-600">{category.description}</p>}

          {user && (
            <button
              onClick={() => setShowForm((v) => !v)}
              className="mt-4 rounded bg-[#536a2d] px-4 py-2 text-white hover:bg-[#405024]"
            >
              {showForm ? "Cancelar" : "Agregar evento a esta categoría"}
            </button>
          )}
        </>
      ) : null}

      {showForm && category && (
        <div className="mt-6">
          <EventForm
            categories={categories ?? []}
            presetCategoryId={category.id}
            onSubmit={handleCreateEvent}
          />
        </div>
      )}

      <h2 className="mt-8 mb-4 text-xl font-bold">Eventos de esta categoría</h2>

      {prodLoading ? (
        <p className="text-center text-gray-500">Cargando eventos…</p>
      ) : prodError ? (
        <ErrorMessage message={prodError.message} title="No se pudieron cargar los eventos" />
      ) : !events || events.length === 0 ? (
        <p className="text-center text-gray-500">Esta categoría no tiene eventos aún.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
