import { useNavigate, Link } from "react-router-dom";
import { useFetch } from "@/hooks/useFetch";
import { createProduct } from "@/services/productService";
import ProductForm from "@/components/EventForm";
import ErrorMessage from "@/components/ErrorMessage";
import type { EventPayload} from "@/types/product";
import type { Category } from "@/types/category";

export default function ProductNewPage() {
  const navigate = useNavigate();
  const { data: categories, loading, error } = useFetch<Category[]>("/categories");

  const handleSubmit = async (data: EventPayload) => {
    await createProduct(data);
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
          <ProductForm categories={categories ?? []} onSubmit={handleSubmit} />
        </div>
      )}
    </div>
  );
}
