import { useState, type FormEvent } from "react";
import type { Event, EventPayload } from "@/types/event";
import type { Category } from "@/types/category";
import ErrorMessage from "./ErrorMessage";
import { ApiError } from "@/lib/errors";

interface ProductFormProps {
  categories: Category[];
  presetCategoryId?: string;
  initialProduct?: Event;
  onSubmit: (data: EventPayload, isEdit: boolean, id?: string) => Promise<void>;
}

export default function ProductForm({ categories, presetCategoryId, initialProduct, onSubmit }: ProductFormProps) {
  const [name, setName] = useState(initialProduct?.name ?? "");
  const [description, setDescription] = useState(initialProduct?.description ?? "");
  const [date, setDate] = useState(initialProduct?.date ?? "");
  const [location, setLocation] = useState(initialProduct?.location ?? "");
  const [price, setPrice] = useState(initialProduct?.price?.toString() ?? "");
  const [capacity, setCapacity] = useState(initialProduct?.capacity?.toString() ?? "");
  const [categoryId, setCategoryId] = useState(initialProduct?.categoryId ?? presetCategoryId ?? "");
  const [imagesText, setImagesText] = useState(initialProduct?.images?.join("\n") ?? "");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-lg space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-xl font-bold">{initialProduct ? "Editar evento" : "Crear evento"}</h2>

      {error && <ErrorMessage message={error} />}

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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Fecha y hora *</label>
          <input
            type="datetime-local"
            value={date ? date.slice(0, 16) : ""}
            onChange={(e) => setDate(new Date(e.target.value).toISOString())}
            required
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Ubicación *</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Precio *</label>
          <input
            type="number"
            min="0"
            step="100"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Capacidad *</label>
          <input
            type="number"
            min="0"
            step="1"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            required
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Categoría *</label>
        <select
          value={categoryId}
          disabled={!!presetCategoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
          className="w-full rounded border border-gray-300 px-3 py-2 disabled:bg-gray-100"
        >
          <option value="">Selecciona una categoría</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Imágenes (URLs, una por línea)</label>
        <textarea
          value={imagesText}
          onChange={(e) => setImagesText(e.target.value)}
          rows={3}
          placeholder={"https://ejemplo.com/imagen1.jpg\nhttps://ejemplo.com/imagen2.jpg"}
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded bg-[#536a2d] py-2 text-white hover:bg-[#405024] disabled:opacity-50"
      >
        {submitting ? "Guardando…" : initialProduct ? "Guardar cambios" : "Crear evento"}
      </button>
    </form>
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!categoryId) {
      setError("Debes seleccionar una categoría");
      return;
    }

    const priceNum = Number(price);
    const capacityNum = Number(capacity);

    if (!name.trim()) {
      setError("El nombre del evento es obligatorio");
      return;
    }

    if (!location.trim()) {
      setError("La ubicación del evento es obligatoria");
      return;
    }

    if (!date) {
      setError("La fecha del evento es obligatoria");
      return;
    }

    if (!Number.isFinite(priceNum) || priceNum < 0) {
      setError("El precio del evento debe ser un número válido");
      return;
    }

    if (!Number.isFinite(capacityNum) || capacityNum < 0) {
      setError("La capacidad del evento debe ser un número válido");
      return;
    }

    const payload: EventPayload = {
      name: name.trim(),
      description: description.trim() || undefined,
      date: date || new Date().toISOString(),
      location: location.trim(),
      price: priceNum,
      capacity: capacityNum,
      categoryId,
      images: imagesText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    if (payload.images?.length === 0) delete payload.images;

    setSubmitting(true);
    try {
      await onSubmit(payload, !!initialProduct, initialProduct?.id);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.kind === "validation") {
          setError(`Datos inválidos: ${err.message}`);
        } else if (err.kind === "network") {
          setError("Problema de conexión con el servidor. Intenta de nuevo.");
        } else {
          setError(err.message || "No se pudo guardar el evento.");
        }
      } else {
        setError("No se pudo guardar el evento.");
      }
    } finally {
      setSubmitting(false);
    }
  }
}
