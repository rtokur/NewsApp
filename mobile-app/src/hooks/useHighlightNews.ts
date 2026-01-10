import { useState, useEffect } from "react";
import { fetchNewsByType } from "../services/newsService";
import { NewsData, HighlightResponse } from "../types/news";

export function useHighlightNews(type: "breaking-highlight" | "recommendations-highlight") {
  const [data, setData] = useState<NewsData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        setLoading(true);
        const result = await fetchNewsByType<HighlightResponse>({ type });
        if (isMounted) setData(result.data);
      } catch (err) {
        if (isMounted) setError("Haber yüklenemedi");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => { isMounted = false; };
  }, [type]);

  return { data, loading, error };
}