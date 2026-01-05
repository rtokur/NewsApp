import { useEffect, useState } from "react";
import { fetchNews } from "../services/newsService";
import { News } from "../types/news";

export function useAllNews() {
  const [data, setData] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadNews = async () => {
      try {
        const result = await fetchNews(1, 10);
        if (isMounted) setData(result);
      } catch {
        if (isMounted) setError("Failed to load news");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadNews();
    return () => {
      isMounted = false;
    };
  }, []);

  return { data, loading, error };
}
