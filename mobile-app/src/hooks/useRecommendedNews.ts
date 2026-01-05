import { useEffect, useState } from "react";
import { fetchRecommendedNews } from "../services/newsService";
import { News } from "../types/news";

export function useRecommendedNews() {
  const [data, setData] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchRecommendNews = async () => {
      try {
        const fetchedRecommended = await fetchRecommendedNews();
        if (isMounted) setData(fetchedRecommended);
      } catch {
        if (isMounted) setError("Failed to load breaking news. Please try again.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchRecommendNews();
    return () => {
      isMounted = false;
    };
  }, []);

  return { data, loading, error };
}
