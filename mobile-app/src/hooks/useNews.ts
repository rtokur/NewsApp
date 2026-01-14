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
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let isMounted = true;

    const loadNews = async () => {
      try {
        page === 1 ? setInitialLoading(true) : setLoading(true);
    
        const result = await fetchNewsByType<PaginatedResponse<NewsData>>({
          page,
          limit,
          type,
          categoryId: categoryId || undefined,
          search: search?.trim() || undefined, 
          sortOrder,
        });

        if (!isMounted) return;

        setData(result.data);
        setTotalPages(result.meta.totalPages ?? 1);
        setError(null);
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

  return { data, loading, initialLoading, error, totalPages };
}
