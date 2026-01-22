import { useCallback, useEffect, useRef, useState } from "react";
import { NewsData } from "../types/news";
import { fetchFavorites } from "../services/favoriteService";

export interface FavoriteItem {
  favoriteId: number;
  news: NewsData;
}

interface UseFavoritesOptions {
  categoryId?: number;
  search?: string;
  sortOrder?: "ASC" | "DESC";
}

export function useFavorites(
  limit = 10,
  options?: UseFavoritesOptions
) {
  const [data, setData] = useState<FavoriteItem[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const categoryId = options?.categoryId;
  const search = options?.search;
  const sortOrder = options?.sortOrder;

  const loadFavorites = useCallback(
    async (reset: boolean) => {
      if (!reset && loading) return;
      if (!reset && !hasMore) return;      

      try {
        setLoading(true);
        setError(null);

        const currentCursor = reset ? undefined : cursor ?? undefined;
        const response = await fetchFavorites(
          limit,
          currentCursor,
          { categoryId, search, sortOrder }
        );

        const mapped = response.items.map((item) => ({
          favoriteId: item.id,
          news: item.news,
        }));

        setData((prev) => {
          if (reset) return mapped;
          const unique = mapped.filter(
            (item) =>
              !prev.some(
                (existing) => existing.favoriteId === item.favoriteId
              )
          );
          return [...prev, ...unique];
        });

        setCursor(response.nextCursor ?? null);
        setHasMore(Boolean(response.nextCursor));
      } catch (err: any) {
        setError(err.message ?? "Failed to load favorites");
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    },
    [cursor, hasMore, loading, limit, categoryId, search, sortOrder]
  );

  useEffect(() => {
    refetch();
  }, [categoryId, search, sortOrder, limit]); 

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadFavorites(false);
    }
  }, [loading, hasMore, loadFavorites]);

  const refetch = useCallback(() => {
    setData([]);
    setCursor(null);
    setHasMore(true);
    setInitialLoading(true);
    loadFavorites(true);
  }, [loadFavorites]);

  const removeLocalItem = useCallback((favoriteId: number) => {
    setData((prev) =>
      prev.filter((item) => item.favoriteId !== favoriteId)
    );
  }, []);

  return {
    data,
    loading,
    initialLoading,
    error,
    hasMore,
    loadMore,
    refetch,
    removeLocalItem,
  };
}