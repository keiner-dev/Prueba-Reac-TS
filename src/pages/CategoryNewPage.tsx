import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createCategory } from "@/services/categoryService";
import ErrorMessage from "@/components/ErrorMessage";
import { ApiError } from "@/lib/errors";

export default function CategoryNewPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e: FormEvent) => {
  
    e.preventDefault();
   
    setError("");

    setSubmitting(true);
    try {
      await createCategory({ name: name.trim(), description: description.trim() || undefined });
      navigate("/categorias");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.kind === "forbidden") {
          setError("No tienes permisos de administrador para crear categorías.");
        } else if (err.kind === "validation") {
          setError(err.message);
        } else if (err.kind === "network") {
          setError("No se pudo conectar con el servidor.");
        } else {
          setError(err.message || "No se pudo crear la categoría.");
        }
      } else {
        setError("No se pudo crear la categoría.");
      }
    } finally {

      setSubmitting(false);
    }
  };


  return (
    <div className="mx-auto mt-6 max-w-md">
      <Link to="/categorias" className="text-blue-600 hover:underline">
        ← Volver
      </Link>

      <div className="mt-4 rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold">Crear categoría</h1>


        {error && <ErrorMessage message={error} />}


        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Nombre *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded bg-gray-900 py-2 text-white hover:bg-gray-700 disabled:opacity-50"
          >
            {submitting ? "Creando…" : "Crear categoría"}
          </button>
        </form>
      </div>
    </div>
  );
}
