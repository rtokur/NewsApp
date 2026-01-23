import { useCallback, useEffect, useState } from "react";
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

  const loadNews = useCallback(async () => {
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

      setData(result.data);
      setTotalPages(result.meta.totalPages ?? 1);
      setError(null);
    } catch {
      setError("Failed to load news");
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [page, type, categoryId, search, sortOrder, limit]);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  const refetch = useCallback(() => {
    loadNews();
  }, [loadNews]);

  return { data, loading, initialLoading, error, totalPages, refetch };
}