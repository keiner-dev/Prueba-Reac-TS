import { useParams, useNavigate, Link } from "react-router-dom";
import { useFetch } from "@/hooks/useFetch";
import { updateProduct } from "@/services/productService";
import ProductForm from "@/components/ProductForm";
import ErrorMessage from "@/components/ErrorMessage";
import type { Product, ProductPayload } from "@/types/product";
import type { Category } from "@/types/category";

export default function ProductEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, loading, error } = useFetch<Product>(id ? `/events/${id}` : "");
  const { data: categories, loading: catLoading, error: catError } = useFetch<Category[]>("/categories");

  const handleSubmit = async (data: ProductPayload, isEdit: boolean, productId?: string) => {
    if (isEdit && productId) {
      await updateProduct(productId, data);
    }
    navigate(`/eventos/${productId}`);
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
      ) : product ? (
        <div className="mt-6">
          <ProductForm
            categories={categories ?? []}
            initialProduct={product}
            onSubmit={handleSubmit}
          />
        </div>
      ) : null}
    </div>
  );
}
