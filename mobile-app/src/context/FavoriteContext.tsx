import { createContext, useState } from "react";
import { addFavorite, removeFavorite } from "../services/favoriteService";

type FavoritesContextType = {
  favorites: Set<number>;
  toggleFavorite: (newsId: number) => Promise<void>;
  isFavorite: (newsId: number) => boolean;
};

export const FavoriteContext = createContext<FavoritesContextType>({
  favorites: new Set(),
  toggleFavorite: async () => {},
  isFavorite: () => false,
});

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const isFavorite = (newsId: number) => favorites.has(newsId);

  const toggleFavorite = async (newsId: number) => {
    const isSaved = favorites.has(newsId);

    setFavorites((prev) => {
      const next = new Set(prev);
      isSaved ? next.delete(newsId) : next.add(newsId);
      return next;
    });

    try {
      isSaved ? await removeFavorite(newsId) : await addFavorite(newsId);
    } catch (error) {
      setFavorites((prev) => {
        const next = new Set(prev);
        isSaved ? next.add(newsId) : next.delete(newsId);
        return next;
      });
    }
  };

  return (
    <FavoriteContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
}
