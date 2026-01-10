import { useState } from "react";
import { useNews } from "./useNews";

export function usePaginatedNews(
  type: "breaking" | "recommendations",
) {
  const [page, setPage] = useState(1);

  const { data, loading, error, hasMore } = useNews({
    page,
    type,
  });

  return {
    data,
    loading,
    error,
    hasMore,
    loadMore: () => setPage((p) => p + 1),
    reset: () => setPage(1),
  };
}
