import { useFetch } from "@/hooks/useFetch";
import CategoryCard from "@/components/CategoryCard";
import ErrorMessage from "@/components/ErrorMessage";
import type { Category } from "@/types/category";

export default function CategoriesPage() {

  const { data: categories, loading, error } = useFetch<Category[]>("/categories");


  return (
    <div>
      {/* Título */}
      <h1 className="mb-4 text-2xl font-bold">Categorías</h1>

      {loading ? (
        <p className="text-center text-gray-500">Cargando categorías…</p>
      ) : error ? (

        <ErrorMessage message={error.message} title="No se pudieron cargar las categorías" />
      ) : !categories || categories.length === 0 ? (
        <p className="text-center text-gray-500">No hay categorías.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      )}
    </div>
  );
}
