import { useState, useEffect } from "react";
import { useFetch } from "@/hooks/useFetch";
import { getFavorites } from "@/services/favoriteService";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import ErrorMessage from "@/components/ErrorMessage";
import type { Product } from "@/types/product";
import type { Category } from "@/types/category";
import { useAuth } from "@/context/auth-context";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const url = buildQuery({ search, categoryId });
  const { data: events, loading, error, refetch } = useFetch<Product[]>(url ? `/events?${url}` : "/events");
  const { data: categories } = useFetch<Category[]>("/categories");
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      (async () => {
        try {
          const favs = await getFavorites();
          setFavoriteIds(favs.map((f) => f.productId));
        } catch {
          setFavoriteIds([]);
        }
      })();
    }
  }, [user]);

  const handleSearch = (term: string) => {
    setSearch(term);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryId(value);
  };

  const handleFavoritesChange = () => {
    if (user) {
      (async () => {
        try {
          const favs = await getFavorites();
          setFavoriteIds(favs.map((f) => f.productId));
        } catch {
          // noop
        }
      })();
    }
    refetch();
  };

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Eventos</h1>

      <div className="mb-4 max-w-xl">
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="mb-6 max-w-xs">
        <label className="mb-1 block text-sm font-medium">Filtrar por categoría</label>
        <select
          value={categoryId}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2"
        >
          <option value="">Todas</option>
          {categories?.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Cargando eventos…</p>
      ) : error ? (
        <ErrorMessage message={error.message} title="No se pudieron cargar los eventos" />
      ) : !events || events.length === 0 ? (
        <p className="text-center text-gray-500">
          {search || categoryId ? "No se encontraron eventos con esos filtros." : "No hay eventos."}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((product: Product) => (
            <ProductCard
              key={product.id}
              product={product}
              isFavorited={favoriteIds.includes(product.id)}
              onFavoritesChange={handleFavoritesChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function buildQuery(params: { search: string; categoryId: string }): string {
  const qp = new URLSearchParams();
  if (params.search) qp.set("search", params.search);
  if (params.categoryId) qp.set("categoryId", params.categoryId);
  return qp.toString();
}
