import { useEffect, useState } from "react";
import { fetchBreakingNews } from "../services/newsService";
import { News } from "../types/news";

export function useBreakingNews() {
  const [data, setData] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadBreakingNews = async () => {
      try {
        const fetchedNews = await fetchBreakingNews();
        if (isMounted) setData(fetchedNews);
      } catch {
        if (isMounted) setError("Failed to load breaking news. Please try again.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadBreakingNews();
    return () => {
      isMounted = false;
    };
  }, []);

  return {
    data,
    loading,
    error,
  };
}