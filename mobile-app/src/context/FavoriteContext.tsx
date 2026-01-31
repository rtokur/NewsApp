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
  favorites: Map<number, number>;
  toggleFavorite: (newsId: number) => Promise<void>;
  isFavorite: (newsId: number) => boolean;
  initialized: boolean;
};

export const FavoriteContext = createContext<FavoritesContextType>({
  favorites: new Map(),
  toggleFavorite: async () => {},
  isFavorite: () => false,
  initialized: false,
});

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Map<number, number>>(new Map());
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    if (!isLoggedIn) {
      setFavorites(new Map());
      setInitialized(true);
      return;
    }

    setInitialized(false);

    api
    .get("v1/favorites")
    .then((res) => {
      const map = new Map<number, number>();
      res.data.items.forEach((item: any) => {
        map.set(Number(item.news.id), Number(item.id));
      });
      setFavorites(map);
    })
      .catch((err) => {
        if (err.response) {
          console.log(
            "Backend Hata Mesajı:",
            JSON.stringify(err.response.data, null, 2)
          );
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
    }, [favorites]);

  const toggleFavorite = useCallback(
    async (newsId: number) => {
      if (loading) return;

      const id = Number(newsId);
      const favoriteId = favorites.get(id);
      setLoading(true);

      try {
        if (favoriteId) {
          setFavorites((prev) => {
            const next = new Map(prev);
            next.delete(id);
            return next;
          });
          await api.delete(`v1/favorites/${favoriteId}`);
        } else {
          const response = await api.post(`v1/favorites/${id}`);
          const newFavoriteId = response.data.id;
          setFavorites((prev) => 
            new Map(prev).set(id, newFavoriteId)
          );
        }
      } catch (error: any) {
        const response = await api.get("v1/favorites");
        const map = new Map<number, number>();
        response.data.items.forEach((item: any) => {
          map.set(Number(item.news.id), Number(item.id));
        });
        setFavorites(map);
        if (error?.response) {
          console.log("Backend Hata Mesajı:", JSON.stringify(error.response.data, null, 2));
        } else {
          console.log("Bağlantı Hatası:", error?.message);
        }
      } finally {
        setLoading(false);
      }
    },
    [favorites, loading]
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
