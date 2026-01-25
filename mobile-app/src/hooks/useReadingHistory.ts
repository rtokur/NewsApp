import { useCallback, useEffect, useRef, useState } from "react";
import { deleteReadingHistory, fetchReadingHistory } from "@/src/services/readingHistoryService";
import { NewsData } from "../types/news";

export interface ReadingHistoryItem {
    id: number;
    news: NewsData;
}

interface UseReadingHistoryOptions {
    categoryId?: number;
    search?: string;
}

export function useReadingHistory(
    limit = 10,
    options?: UseReadingHistoryOptions
) {
  const [data, setData] = useState<ReadingHistoryItem[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const categoryId = options?.categoryId;
    const search = options?.search;

  const loadReadingHistory = useCallback(
    async (reset: boolean) => {
        if (!reset && loading) return;
        if (!reset && !hasMore) return;

    try {
      setLoading(true);
      setError(null);
        const currentCursor = reset ? undefined : cursor ?? undefined;

      const response = await fetchReadingHistory(
        limit,
        currentCursor,
        { categoryId, search }
      );

      const mapped = response.items.map((item) => ({
        id: item.id,
        news: item.news,
      }));
        setData((prev) => {
            if (reset) return mapped;
            const unique = mapped.filter(
            (item) =>
                !prev.some(
                (existing) => existing.id === item.id
                )
            );
            return [...prev, ...unique];
        });

        setCursor(response.nextCursor ?? null);

      setHasMore(Boolean(response.nextCursor));
    } catch (e: any) {
      setError("Reading history could not be loaded");
    } finally {
      setLoading(false);
        setInitialLoading(false);
    }
  },
    [limit, cursor, loading, hasMore, categoryId, search]
  );

  useEffect(() => {
    refetch();
    }, [categoryId, search, limit]);

  const loadMore = useCallback(() => {
      if (!loading && hasMore) {
        loadReadingHistory(false);
      }
    }, [loadReadingHistory]);

  const refetch = useCallback(() => {
    setData([]);
    setCursor(null);
    setHasMore(true);
    setInitialLoading(true);
    loadReadingHistory(true);
    }, [loadReadingHistory]);   
    
    const remove = useCallback(async (newsId: number) => {
        try {
          await deleteReadingHistory(newsId);
    
          setData((prev) =>
            prev.filter((item) => item.news.id !== newsId)
          );
        } catch (e) {
          throw new Error("DELETE_FAILED");
        }
      }, []);
  return {
    data,
    loading,
    initialLoading,
    error,
    hasMore,
    loadMore,
    refetch,
    remove,
  };
}
