import { useAuth } from "@/context/auth-context";
import * as favoriteService from "@/services/favoriteService";


interface FavoriteButtonProps {
  productId: string;
  isFavorited: boolean;
  onChange?: () => void;
}


export default function FavoriteButton({ productId, isFavorited, onChange }: FavoriteButtonProps) {
  const { user } = useAuth();
  if (!user) return null;

  const toggleFavorite = async () => {
    try {
      if (isFavorited) {
        await favoriteService.removeFavorite(productId);
      } else {
        await favoriteService.addFavorite(productId);
      }
      if (onChange) onChange();
    } catch {
      alert("No se pudo actualizar el favorito. Intenta de nuevo.");
    }
  };


  return (
    <button
      onClick={toggleFavorite}
      aria-label={isFavorited ? "Quitar de favoritos" : "Agregar a favoritos"}
      className={`rounded-full border px-3 py-1 text-sm transition-colors ${
        isFavorited
          ? "border-red-500 bg-red-500 text-white hover:bg-red-600"
          : "border-gray-300 text-gray-600 hover:bg-gray-100"
      }`}
    >
      {isFavorited ? "♥ Quitar" : "♡ Favorito"}
    </button>
  );
}
