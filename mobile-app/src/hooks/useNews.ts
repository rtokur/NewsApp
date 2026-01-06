import { useEffect, useState } from "react";
import { fetchNews } from "../services/newsService";
import { News, NewsData } from "../types/news";

interface UseNewsParams {
  page: number;
  categoryId?: number;
  search?: string;
  sortOrder?: "ASC" | "DESC";
}

export function useNews({
  page,
  categoryId,
  search,
  sortOrder,
}: UseNewsParams) {
  const [data, setData] = useState<NewsData[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadNews = async () => {
      try {
        if (page === 1) {
          setInitialLoading(true);
        } else {
          setLoading(true);
        }
        const result = await fetchNews({
          page,
          limit: 10,
          categoryId: categoryId && categoryId !== 0 ? categoryId : undefined,
          search: search?.trim() || undefined,
          sortOrder,
        });

        if (!isMounted) return;

        setData((prev) => {
          if (page === 1) return result.data;

          const existingIds = new Set(prev.map((item) => item.id));
          const newItems = result.data.filter(
            (item) => !existingIds.has(item.id)
          );

          return [...prev, ...newItems];
        });

        setHasMore(page < (result.meta?.totalPages ?? 1));
      } catch {
        if (isMounted) setError("Failed to load news");
      } finally {
        if (isMounted) {
          setLoading(false);
          setInitialLoading(false);
        }
      }
    };

    loadNews();
    return () => {
      isMounted = false;
    };
  }, [page, categoryId, search, sortOrder]);

  return { data, loading, initialLoading, error, hasMore };
}
