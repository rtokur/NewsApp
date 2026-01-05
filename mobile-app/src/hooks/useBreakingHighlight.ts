import { useEffect, useState } from "react";
import { fetchBreakingNewsHighlight } from "../services/newsService";
import { News } from "../types/news";

export function useBreakingHighlight() {
  const [data, setData] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadBreakingHighlight = async () => {
      try {
        const response = await fetchBreakingNewsHighlight();
        if (isMounted) setData(response);
      } catch {
        if (isMounted)
          setError("Failed to load breaking highlight. Please try again.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadBreakingHighlight();
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
