import { useFetch } from "@/hooks/useFetch";
import EventCard from "@/components/EventCard";
import ErrorMessage from "@/components/ErrorMessage";
import type { Favorite } from "@/types/favorites";

export default function FavoritesPage() {
  const { data: favorites, loading, error, refetch } = useFetch<Favorite[]>("/favorites");

  const handleFavoritesChange = () => {
    refetch();
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Mis favoritos</h1>

      {loading ? (
        <p className="text-center text-gray-500">Cargando favoritos…</p>
      ) : error ? (
        <ErrorMessage message={error.message} title="No se pudieron cargar los favoritos" />
      ) : !favorites || favorites.length === 0 ? (
        <p className="text-center text-gray-500">No tienes eventos en favoritos.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((fav) =>
            fav.product ? (
              <EventCard
                key={fav.id}
                event={fav.product}
                isFavorited={true}
                onFavoritesChange={handleFavoritesChange}
              />
            ) : null
          )}
        </div>
      )}
    </div>
  );
}
