import { useParams, Link, useNavigate } from "react-router-dom";
import { useFetch } from "@/hooks/useFetch";
import { deleteProduct } from "@/services/productService";
import ErrorMessage from "@/components/ErrorMessage";
import FavoriteButton from "@/components/FavoriteButton";
import { useAuth } from "@/context/auth-context";
import type { Product } from "@/types/product";
import { formatPrice } from "@/utils/format";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: product, loading, error, refetch } = useFetch<Product>(id ? `/events/${id}` : "");

  const handleDelete = async () => {
    if (!window.confirm("¿Seguro que deseas eliminar este evento?")) return;
    try {
      if (id) await deleteProduct(id);
      navigate("/");
    } catch {
      alert("No se pudo eliminar el evento.");
    }
  };

  const formattedDate = product?.date
    ? new Date(product.date).toLocaleString("es-ES", {
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
      ) : product ? (
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <div className="flex h-80 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
            {product.images?.[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
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
            <h1 className="text-3xl font-bold">{product.name}</h1>
            {product.category?.name && <p className="text-sm text-gray-500">{product.category.name}</p>}
            <p className="mt-4 text-lg font-semibold text-[#536a2d]">{formattedDate}</p>
            {product.location && <p className="mt-1 text-gray-700">{product.location}</p>}
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-700">
              <span className="rounded bg-[#edf3df] px-2 py-1 font-medium text-[#2f4610]">
                {formatPrice(product.price ?? 0)}
              </span>
              <span className="rounded bg-[#edf3df] px-2 py-1 font-medium text-[#2f4610]">
                {product.capacity ?? 0} asistentes
              </span>
            </div>
            {product.description && <p className="mt-4 text-gray-700">{product.description}</p>}

            <div className="mt-6">
              <FavoriteButton productId={product.id} isFavorited={false} onChange={refetch} />
            </div>

            {user && (
              <div className="mt-6 flex gap-3">
                <Link
                  to={`/eventos/${product.id}/editar`}
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
