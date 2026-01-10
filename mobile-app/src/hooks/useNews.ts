import { useEffect, useState } from "react";
import { fetchNewsByType, FetchNewsParams } from "../services/newsService";
import { NewsData, PaginatedResponse } from "../types/news";

export function useNews({
  type = "all",
  page = 1,
  limit,
  categoryId,
  search,
  sortOrder = "DESC",
}: FetchNewsParams) {
  const [data, setData] = useState<NewsData[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setData([]);
    setHasMore(true);
  }, [type, categoryId, search, sortOrder]);

  useEffect(() => {
    let isMounted = true;

    const loadNews = async () => {
      try {
        if (page === 1) {
          setInitialLoading(true);
        } else {
          setLoading(true);
        }
    
        const result = await fetchNewsByType<PaginatedResponse<NewsData>>({
          page,
          limit,
          type,
          categoryId: categoryId || undefined,
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

        setHasMore(page < (result.meta.totalPages ?? 1));
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
  }, [page, type, categoryId, search, sortOrder]);

  return { data, loading, initialLoading, error, hasMore };
}
