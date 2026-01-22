import {
  createContext,
  useCallback,
  useEffect,
  useState,
  useContext,
} from "react";
import api from "../services/api";
import { AuthContext } from "./AuthContext";

type FavoritesContextType = {
  favorites: Set<number>;
  toggleFavorite: (newsId: number) => Promise<void>;
  isFavorite: (newsId: number) => boolean;
  initialized: boolean;
};

export const FavoriteContext = createContext<FavoritesContextType>({
  favorites: new Set(),
  toggleFavorite: async () => {},
  isFavorite: () => false,
  initialized: false,
});

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [initialized, setInitialized] = useState(false);

  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    if (!isLoggedIn) {
      setFavorites(new Set());
      setInitialized(true);
      return;
    }

    setInitialized(false);

    api
      .get("v1/favorites")
      .then((response) => {
        const favIds = new Set<number>(
          response.data.items.map((item: any) => Number(item.news.id))
        );
        setFavorites(favIds);
      })
.catch((err) => {
  if (err.response) {
      console.log("Backend Hata Mesajı:", JSON.stringify(err.response.data, null, 2));
  } else {
      console.log("Bağlantı Hatası:", err.message);
  }
})
      .finally(() => {
        setInitialized(true);
      });
  }, [isLoggedIn]);

  const isFavorite = useCallback(
    (newsId: number) => {
      return favorites.has(Number(newsId));
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    async (newsId: number) => {
      const id = Number(newsId);
      const isSaved = favorites.has(id);

      setFavorites((prev) => {
        const next = new Set(prev);
        isSaved ? next.delete(id) : next.add(id);
        return next;
      });

      try {
        if (isSaved) {
          await api.delete(`v1/favorites/${id}`);
        } else {
          await api.post(`v1/favorites/${id}`, {});
        }
      } catch (error: any) {
        setFavorites((prev) => {
          const next = new Set(prev);
          isSaved ? next.add(id) : next.delete(id);
          return next;
        });
        if (error?.response) {
          console.log("Backend Hata Mesajı:", JSON.stringify(error.response.data, null, 2));
        } else {
          console.log("Bağlantı Hatası:", error?.message);
        }
        throw error;
      }
    },
    [favorites]
  );

  return (
    <FavoriteContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        initialized,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
}
