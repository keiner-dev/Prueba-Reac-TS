
import { useNavigate, Link } from "react-router-dom";
import { useFetch } from "@/hooks/useFetch";
import { createEvent } from "@/services/eventService";
import EventForm from "@/components/EventForm";
import ErrorMessage from "@/components/ErrorMessage";
import type { EventPayload } from "@/types/event";
import type { Category } from "@/types/category";

export default function EventNewPage() {
  const navigate = useNavigate();
  const { data: categories, loading, error } = useFetch<Category[]>("/categories");

  const handleSubmit = async (data: EventPayload) => {
    await createEvent(data);
    navigate("/");
  };

  return (
    <div className="mx-auto max-w-lg">
      <Link to="/" className="text-[#536a2d] hover:underline">
        ← Volver
      </Link>

      {loading ? (
        <p className="mt-6 text-center text-gray-500">Cargando formulario…</p>
      ) : error ? (
        <div className="mt-6">
          <ErrorMessage message={error.message} title="No se pudieron cargar las categorías" />
        </div>
      ) : (
        <div className="mt-6">
          <EventForm categories={categories ?? []} onSubmit={handleSubmit} />
        </div>
      )}
    </div>
  );
}
